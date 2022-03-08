import meta       from './meta'
import livestream from './livestream'
import events     from './events'
import viewers    from './viewers'
import { logger } from '@/utils'
import axios      from 'axios'

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

  get = url => {
    logger.info( `API`, `Gettig ${ url }.` )
    return new Promise( ( resolve, reject ) => 
      axios
      .get( url )
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
}
