import axios   from 'axios'
import config  from '@/config'
import $log    from '@/utils/log'

export default {


  get_by_uuid( uuid ) {
    $log.info( `API`, `Fetching viewer by uuid ${ uuid }.` )
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

  get_by_id( id ) {
    $log.info( `API`, `Fetching viewer by id ${ id }.` )
    return new Promise( ( resolve, reject ) =>
      axios
      .get( `${ config.api_url }/viewers/${ id }`, { params: {
        fields: '*',
        populate: [
          'events'
        ]
      }})
      .then( result => {
        const viewer = result.data.data
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
    $log.info( `API`, `Fetching viewers.` )
    return new Promise( ( resolve, reject ) => {
      axios
      .get( `${ config.api_url }/viewers`, { params: {
        pagination: {
          start: 0,
          limit: 300,
        },
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
        $log.error( 'API', error )
        reject( error )
      } )
    } )
  },

  post( data ) {
    $log.info( `API`, `Posting viewer ${ data.name }.`)
    return new Promise( ( resolve, reject ) => {
      axios
      .post( `${ config.api_url }/viewers`, { data } )
      .then( result => {
        const viewer = result.data.data
        resolve( viewer )
      } )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    } )
  },


  put( id, data ) {
    $log.info( `API`, `Updating viewer ${ id }.`)
    return new Promise( ( resolve, reject ) => {
      axios
      .put( `${ config.api_url }/viewers/${ id }`, { data } )
      .then( result => {
        const viewer = result.data.data
        resolve( viewer )
      } )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    } )
  },


}
