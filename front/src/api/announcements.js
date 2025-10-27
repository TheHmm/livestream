import axios   from 'axios'
import config  from '@/config'
import $log    from '@/utils/log'

export default {

  get_by_event( event_id ) {
    $log.info( `API`, `Fetching announcements.` )
    return new Promise( ( resolve, reject ) => {
      axios
      .get( `${ config.api_url }/announcements`, { params: {
        sort: 'publishedAt:asc',
        filters: {
          events: {
            documentId: {
              $eq: event_id
            }
          },
          show: true
        },
        fields: '*',
      } } )
      .then( result => {
        const announcements = result.data.data
        resolve( announcements )
      } )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    } )
  },

}
