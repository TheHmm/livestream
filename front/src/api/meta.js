import axios      from 'axios'
import config     from '@/config'
import $log       from '@/utils/log'

export default {


  // Fetch website meta-data.

  get() {
    $log.info( `API`, `Fetching meta.` )
    return new Promise( ( resolve, reject ) =>
      axios
      .get( `${ config.api_url }/meta`, {})
      .then( result => resolve( result.data.data ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    )
  },

  // Donate to the Hmm. Custom strapi api endpoint.

  donate({ amount, description, from }) {
    $log.info( `API`, `Donating ${ amount } euros.` )
    return new Promise( ( resolve, reject ) =>
      axios
      .post( `${ config.api_url }/meta/donate`, { amount, description, from } )
      .then( result => resolve( result.data.data ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      })
    )
  }

}
