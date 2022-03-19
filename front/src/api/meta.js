import axios      from 'axios'
import config     from '@/config'
import { logger } from '@/utils'
  
export default {

    
  // Fetch website meta-data.

  get() { 
    logger.info( `API`, `Fetching meta.` )
    return new Promise( ( resolve, reject ) => 
      axios
      .get( `${ config.api_url }/meta`, {})
      .then( result => resolve( result.data.data ) )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    ) 
  },

  donate({ amount, description }) {
    logger.info( `API`, `Donating ${ amount } euros.` )
    return new Promise( ( resolve, reject ) => 
      axios
      .post( `${ config.api_url }/meta/donate`, { amount, description } )
      .then( result => resolve( result.statusText ) )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    ) 
  }

}
