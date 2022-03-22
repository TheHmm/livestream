import axios      from 'axios'
import config     from '@/config'
import { logger } from '@/utils'

export default {


  get( uuid ) { 
    logger.info( `API`, `Fetching viewer ${ uuid }.` )
    return new Promise( ( resolve, reject ) => 
      axios 
      .get( `${ config.api_url }/viewers`, { params: { uuid } } )
      .then( result => resolve( result.data ) )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    ) 
  },

  get_by_event( event_id ) { 
    logger.info( `API`, `Fetching viewers.` )
    return new Promise( ( resolve, reject ) => {
      axios
      .get( `${ config.api_url }/viewers`, { params: { 
        filters: {
          events: {
            id: {
              $eq: event_id
            }
          },
        },
        fields: '*',
      } } )
      .then( result => {
        const viewers = result.data.data
        resolve( viewers )
      } )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    } ) 
  },

  post( { name, event_id } ) {
    logger.info( `API`, `Posting viewer ${ name }.`)
    return new Promise( ( resolve, reject ) => {
      axios
      .post( `${ config.api_url }/viewers`, { data: { 
        name, 
        events: [event_id]
      }})
      .then( result => {
        const viewer = result.data.data
        resolve( viewer )
      } )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    } ) 
  },

  // put( {  } ) { }



}
