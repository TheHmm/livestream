import { logger }    from '@/utils'
import axios         from 'axios'
import qs            from 'qs'

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
    return qs.stringify( params, {
      encode: false,
    })
  }
  return config 
} )


const 

  head = url => {
    logger.info( `API`, `Heading ${ url }.` )
    return new Promise( ( resolve, reject ) => 
      axios
      .head( url )
      .then( result => resolve( result ) )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    ) 
  },

  get = (url, opts) => {
    logger.info( `API`, `Getting ${ url }.` )
    return new Promise( ( resolve, reject ) => 
      axios
      .get( url, opts)
      .then( result => resolve( result ) )
      .catch( error => {
        logger.error( 'API', error ) 
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
