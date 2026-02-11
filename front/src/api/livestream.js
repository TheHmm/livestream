import axios  from 'axios'
import config from '@/config'
import $log   from '@/utils/log'

export default {


  // Fetch livestream publicData from Strapi. Called
  // once only, all other updates to the livestream
  // will be received from the socket server.

  get_by_event( event_id ) {
    $log.info( `API`, `Fetching livestream.` )
    return new Promise( ( resolve, reject ) =>
      axios
      .get( `${ config.api_url }/livestreams/`, {
        params: {
          fields: '*',
          populate: {
            events: {
              fields: 'documentId'
            }
          },
          filters: {
            events: {
              documentId: {
                $eq: event_id
              }
            },
          },
        }
      })
      .then( result => resolve( result.data.data[0] ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    )
  },

  get_all() {
    $log.info( `API`, `Fetching all livestreams.` )
    return new Promise( ( resolve, reject ) =>
      axios
      .get( `${ config.api_url }/livestreams/`, {
        params: {
          fields: '*',
        }
      })
      .then( result => resolve( result.data.data ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    )
  },

  request_access({ slug, key }) {
    $log.info( `API`, `Requesting priviledged access to livestream ${ slug }.` )
    return new Promise( ( resolve, reject ) =>
      axios
      .post( `${ config.api_url }/livestreams/${ slug }/authenticate`, { key })
      .then( result => resolve( result.data.data ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    )
  },


}
