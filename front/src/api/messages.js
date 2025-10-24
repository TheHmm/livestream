import axios  from 'axios'
import config from '@/config'
import $log   from '@/utils/log'

let pageSize = 20
let page = 0
let current_event_id = null


export default {

  get_by_event( event_id ) {
    $log.info( `API`, `Fetching messages.` )

    if ( !current_event_id ) {
      current_event_id = event_id
    }
    if ( current_event_id == event_id ) {
      page ++
    } else {
      page = 1
    }
    current_event_id = event_id
    console.log( event_id )
    return new Promise( ( resolve, reject ) => {
      axios
      .get( `${ config.api_url }/messages`, { params: {
        sort: 'time:desc',
        pagination: {
          page,
          pageSize,
        },
        filters: {
          event: {
            documentId: {
              $eq: event_id
            }
          },
        },
        fields: '*',
        populate: [
          'sender',
          'event'
        ],
      } } )
      .then( result => resolve( result.data.data ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    } )
  },

  get_all_event_messages( event_id ) {
    return new Promise( ( resolve, reject ) => {
      axios
      .get( `${ config.api_url }/messages`, { params: {
        sort: 'time:asc',
        pagination: {
          start: 0,
          limit: 700,
        },
        filters: {
          event: {
            documentId: {
              $eq: event_id
            }
          },
        },
        fields: '*',
        populate: [
          'sender'
        ],
      } } )
      .then( result => resolve( result.data.data ) )
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
