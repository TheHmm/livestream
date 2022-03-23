import axios      from 'axios'
import config     from '@/config'
import { logger } from '@/utils'

export default {


  // get( time ) { 
  //   logger.info( `API`, `Fetching message ${ time }.` )
  //   return new Promise( ( resolve, reject ) => 
  //     axios 
  //     .get( `${ config.api_url }/messages`, { params: { time } } )
  //     .then( result => resolve( result.data ) )
  //     .catch( error => {
  //       logger.error( 'API', error ) 
  //       reject( error )
  //     } )
  //   ) 
  // },

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
        resolve( messages )
      } )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    } ) 
  },

  post( data ) {
    logger.info( `API`, `Posting message ${ data.body }.`)
    return new Promise( ( resolve, reject ) => {
      axios
      .post( `${ config.api_url }/messages`, { data } )
      .then( result => {
        const message = result.data.data
        resolve( message )
      } )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    } ) 
  },


  put( id, data ) {
    logger.info( `API`, `Updating message ${ id }.`)
    return new Promise( ( resolve, reject ) => {
      axios
      .put( `${ config.api_url }/messages/${ id }`, { data } )
      .then( result => {
        const message = result.data.data
        resolve( message )
      } )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    } ) 
  },


  delete( id ) {
    logger.info( `API`, `Deleting message ${ id }.`)
    return new Promise( ( resolve, reject ) => {
      axios
      .delete( `${ config.api_url }/messages/${ id }` )
      .then( result => {
        const message = result.data.data
        resolve( message )
      } )
      .catch( error => {
        logger.error( 'API', error ) 
        reject( error )
      } )
    } ) 
  },



}
