import $log          from '@/utils/log'
import axios         from 'axios'
import {stringify}   from 'qs'

import meta          from './meta'
import livestream    from './livestream'
import events        from './events'
import viewers       from './viewers'
import messages      from './messages'
import announcements from './announcements'

axios
.interceptors
.request
.use( config => {
  config.paramsSerializer = params => {
    return stringify( params, {
      encode: false,
    })
  }
  return config 
} )


const 

  head = url => {
    $log.info( `API`, `Heading ${ url }.` )
    return new Promise( ( resolve, reject ) => 
      axios
      .head( url )
      .then( result => resolve( result ) )
      .catch( error => {
        $log.error( 'API', error ) 
        reject( error )
      } )
    ) 
  },

  get = (url, opts) => {
    $log.info( `API`, `Getting ${ url }.` )
    return new Promise( ( resolve, reject ) => 
      axios
      .get( url, opts)
      .then( result => resolve( result ) )
      .catch( error => {
        $log.error( 'API', error ) 
        reject( error )
      } )
    ) 
  }





export default {
  head,
  get,
  meta, 
  livestream,
  events,   
  viewers,
  messages,
  announcements
}
