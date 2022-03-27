import axios  from 'axios'
import config from '@/config'
import $log   from '@/utils/log'

export default {


  // get( time ) { 
  //   $log.info( `API`, `Fetching message ${ time }.` )
  //   return new Promise( ( resolve, reject ) => 
  //     axios 
  //     .get( `${ config.api_url }/messages`, { params: { time } } )
  //     .then( result => resolve( result.data ) )
  //     .catch( error => {
  //       $log.error( 'API', error ) 
  //       reject( error )
  //     } )
  //   ) 
  // },

  get_by_event( event_id ) { 
    $log.info( `API`, `Fetching messages.` )
    return new Promise( ( resolve, reject ) => {
      axios
      .get( `${ config.api_url }/messages`, { params: { 
        sort: 'time:desc',
        pagination: {
          start: 0,
          limit: 500,
        },
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
        ],
      } } )
      .then( result => {
        const messages = result.data.data
        resolve( messages )
      } )
      .catch( error => {
        $log.error( 'API', error ) 
        reject( error )
      } )
    } ) 
  },

  post( data ) {
    $log.info( `API`, `Posting message ${ data.body }.`)
    return new Promise( ( resolve, reject ) => {
      axios
      .post( `${ config.api_url }/messages`, { data } )
      .then( result => {
        const message = result.data.data
        resolve( message )
      } )
      .catch( error => {
        $log.error( 'API', error ) 
        reject( error )
      } )
    } ) 
  },


  put( id, data ) {
    $log.info( `API`, `Updating message ${ id }.`)
    return new Promise( ( resolve, reject ) => {
      axios
      .put( `${ config.api_url }/messages/${ id }`, { data } )
      .then( result => {
        const message = result.data.data
        resolve( message )
      } )
      .catch( error => {
        $log.error( 'API', error ) 
        reject( error )
      } )
    } ) 
  },


  delete( id ) {
    $log.info( `API`, `Deleting message ${ id }.`)
    return new Promise( ( resolve, reject ) => {
      axios
      .delete( `${ config.api_url }/messages/${ id }` )
      .then( result => {
        const message = result.data.data
        resolve( message )
      } )
      .catch( error => {
        $log.error( 'API', error ) 
        reject( error )
      } )
    } ) 
  },



}
