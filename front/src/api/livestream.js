import axios  from 'axios'
import config from '@/config'
import $log   from '@/utils/log'

export default {


  // Fetch livestream publicData from Strapi. Called
  // once only, all other updates to the livestream
  // will be received from the socket server.

  get() {
    $log.info( `API`, `Fetching livestream.` )
    return new Promise( ( resolve, reject ) =>
      axios
      .get( `${ config.api_url }/livestream` )
      .then( result => resolve( result.data.data.publicData ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    )
  }


}
