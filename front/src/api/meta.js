import axios      from 'axios'
import config     from '@/config'
import $log       from '@/utils/log'

export default {


  // Fetch website meta-data.

  get() {
    $log.info( `API`, `Fetching meta.` )
    return new Promise( ( resolve, reject ) =>
      axios
      .get( `${ config.api_url }/meta`, { params: {
        fields: [
          'about',
          'censorMessage',
          'tagline',
        ],
        populate: [
          'renting_options'
        ]
      }})
      .then( result => resolve( result.data.data ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    )
  },

}
