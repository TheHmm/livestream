import axios      from 'axios'
import config     from '@/config'
import { logger } from '@/utils'

export default {


  get( uuid ) { 
    logger.info( `API`, `Fetching viewer ${ uuid }.` )
    return new Promise( ( resolve, reject ) => 
      axios 
      .get( `${ config.api_url }/viewers`, { params: {
        filters: {
          uuid: {
            $eq: uuid
          },
        },
        fields: '*', 
        populate: [
          'events'
        ]
      }})
      .then( result => {
        const viewer = result.data.data[0]
        if ( viewer ) {
          resolve( viewer) 
        } else {
          throw new Error( '404' ) 
        }
      })
      .catch( error => {
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

  post( data ) {
    logger.info( `API`, `Posting viewer ${ data.name }.`)
    return new Promise( ( resolve, reject ) => {
      axios
      .post( `${ config.api_url }/viewers`, { data } )
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


  put( id, data ) {
    logger.info( `API`, `Posting viewer ${ id }.`)
    return new Promise( ( resolve, reject ) => {
      axios
      .put( `${ config.api_url }/viewers/${ id }`, { data } )
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


}
