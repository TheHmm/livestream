import axios      from 'axios'
import config     from '../config'
import { logger } from '../utils'

const

  api_url = config.apiURL,
  
  meta = {

    
    // Fetch website meta-data.

    get: () => { 
      return new Promise( async resolve => 
        axios
        .get( `${ api_url }/meta` )
        .then( result => resolve( result.data.data.attributes ) )
        .catch( error => logger.error( 'API', error ) )
      ) 
    } 

  },

  livestream = {


    // Fetch livestream publicData from Strapi. Called
    // once only, all other updates to the livestream
    // will be received from the socket server.

    get: () => { 
      logger.info( `API`, `Fetching livestream.` )
      return new Promise( resolve => 
        axios
        .get( `${ api_url }/livestream` )
        .then( result => resolve( result.data.data.attributes.publicData ) )
        .catch( error => logger.error( 'API', error ) )
      ) 
    } 

  },
    
  events = {


    // This method counts our events before fetching them
    // See: back/src/api/event/controllers/event.js
      
    count: () => { 
      logger.info( `API`, `Counting events.` )
      return new Promise( resolve => {
        axios
        .get( `${ api_url }/events/count` )
        .then( result => resolve( result.data ) )
        .catch( error => logger.error( 'API', error ) )
      } ) 
    },

    
    // Fetch all events; sort in reverse chronological 
    // order (i.e. most recent event first).

    getAll: () => { 
      logger.info( `API`, `Fetching events.` )
      return new Promise( resolve => {
        axios
        .get( `${ api_url }/events`, { params: { 
          sort: 'starts:desc',
          fields: [ 
            'title',
            'slug',
            'starts',
            'ends',
            'info',
            'recordingURL'
          ],
          populate: [
            'logo'
          ]
        } } )
        .then( result => {
          const events = result.data.data
          for ( let e = 0; e < events.length; e ++ ) {
            events[e] = { 
              ...events[e], 
              ...events[e].attributes 
            }
            delete events[e].attributes
          }
          resolve( events )
        } )
        .catch( error => logger.error( 'API', error ) )
      } ) 
    },


    // Fetch event by slug. Non-standard implementation
    // See: back/src/api/event/controllers/event.js

    get: slug => { 
      logger.info( `API`, `Fetching event ${ slug }.` )
      return new Promise( resolve => {
        axios
        .get( 
          `${ api_url }/events/${ slug }`, { params: { 
            fields: '*',
            populate: [
              'logo',
              'viewers',
              'messages',
              'announcements',
              'emoji_groups',
            ]
          } } )
        .then( result => {
          const 
            data  = result.data.data,
            event = { ...data, ...data.attributes }
          delete event.attributes
          resolve( event )
        } )
        .catch( error => logger.error( 'API', error ) )
      } ) 
    }
  },
  
  viewers = { 

    get: uuid => { 
      return new Promise( resolve => 
        axios 
        .get( `${ api_url }/viewers`, { params: { uuid } } )
        .then( result => resolve( result.data ) )
        .catch( error => logger.error( 'API', error ) )
      ) 
    } 
    
  },


  // API to HEAD assets. Note here we aren't passing our
  // strapi url, so axios defaults to origin.

  assets = {

    head: asset => {
      logger.info( `API`, `Heading asset ${ asset }.` )
      return new Promise( resolve => 
        axios
        .head( asset )
        .then( result => resolve( result ) )
        .catch( error => logger.error( 'API', error ) )
      ) 
    }

  }



export default {
  meta,
  livestream,
  events,   
  viewers,
  assets,
}
