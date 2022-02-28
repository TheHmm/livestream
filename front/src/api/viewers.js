import axios      from 'axios'
import config     from '@/config'
import { logger } from '@/utils'

export default {


  get( uuid ) { 
    logger.info( `API`, `Fetching livestream.` )
    return new Promise( ( resolve, reject ) => 
      axios 
      .get( `${ config.api_url }/viewers`, { params: { uuid } } )
      .then( result => resolve( result.data ) )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    ) 
  } 



}
