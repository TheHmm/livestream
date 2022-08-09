import $log          from '@/utils/log'
import axios         from 'axios'
import { stringify } from 'qs'


// Our namespacec API endpoints ( e.g. api.messages.post() )

import meta          from './meta'
import livestream    from './livestream'
import events        from './events'
import viewers       from './viewers'
import messages      from './messages'
import announcements from './announcements'


// Configure axios to stringify parameters in he way Strapi
// likes them.

axios.interceptors.request.use( config => {
  config.paramsSerializer = params => {
    return stringify( params, { encode: false } )
  }
  return config
})


// Basic get endpoint to make requests unrelated to the app.
// for instance to get assets from MUX.

const get = ( url, opts ) => {
  $log.info( `API`, `Getting ${ url }.` )
  return new Promise( ( resolve, reject ) =>
    axios
    .get( url, opts )
    .then( result => resolve( result ) )
    .catch( error => {
      $log.error( 'API', error )
      reject( error )
    } )
  )
}


export default {
  get,
  meta,
  livestream,
  events,
  viewers,
  messages,
  announcements
}
