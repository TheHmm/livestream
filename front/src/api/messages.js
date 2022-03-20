import axios      from 'axios'
import config     from '@/config'
import { logger } from '@/utils'

export default {


  get( time ) { 
    logger.info( `API`, `Fetching message ${ time }.` )
    return new Promise( ( resolve, reject ) => 
      axios 
      .get( `${ config.api_url }/messages`, { params: { time } } )
      .then( result => resolve( result.data ) )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    ) 
  },

  get_by_event( event_id ) { 
    logger.info( `API`, `Fetching messages.` )
    return new Promise( ( resolve, reject ) => {
      axios
      .get( `${ config.api_url }/messages`, { params: { 
        sort: 'time:asc',
        filters: {
          event: {
            id: {
              $eq: event_id
            }
          },
        },
        fields: '*',
        populate: [
          'sender'
        ]
      } } )
      .then( result => {
        const messages = result.data.data
        console.log(messages)
        resolve( messages )
      } )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    } ) 
  },



}
