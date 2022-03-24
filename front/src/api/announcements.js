import axios      from 'axios'
import config     from '@/config'
import { logger } from '@/utils'

export default {

  get_by_event( event_id ) { 
    logger.info( `API`, `Fetching announcements.` )
    return new Promise( ( resolve, reject ) => {
      axios
      .get( `${ config.api_url }/announcements`, { params: { 
        sort: 'publishedAt:asc',
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
        const announcements = result.data.data
        resolve( announcements )
      } )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    } ) 
  },

}
