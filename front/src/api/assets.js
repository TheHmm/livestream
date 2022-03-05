import axios      from 'axios'
import { logger } from '@/utils'

export default {
  

  // API to HEAD assets. Note here we aren't passing our
  // strapi url, so axios defaults to origin.

  head( asset ) {
    logger.info( `API`, `Heading asset ${ asset }.` )
    return new Promise( ( resolve, reject ) => 
      axios
      .head( asset )
      .then( result => resolve( result ) )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    ) 
  },

  get( asset ) {
    logger.info( `API`, `Getting asset ${ asset }.` )
    return new Promise( ( resolve, reject ) => 
      axios
      .get( asset )
      .then( result => resolve( result ) )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    ) 
  }

}
