import axios               from 'axios'
import config              from '../config'
import { Service }         from 'axios-middleware'
import { logger, network } from '../utils'
import store               from '../store'

// axios.defaults.baseURL = config.apiURL

const

  strapi = axios.create( { baseURL: config.apiURL } ),
  
  meta = {

    get: () => { 
      return new Promise( async ( resolve, reject ) => 
        strapi
        .get( `meta` )
        .then( result => resolve( result.data.data.attributes ) )
        .catch( error => reject( error ) )
      ) 
    } 

  },

  livestream = {

    get: () => { 
      logger.info( `API`, `Fetching livestream.` )
      return new Promise( ( resolve, reject ) => 
        strapi
        .get( `livestream` )
        .then( result => resolve( result.data.data.attributes.publicData ) )
        .catch( error => reject( error ) )
      ) 
    } 

  },
    
  events = {

    count: () => { 
      logger.info( `API`, `Counting events.` )
      return new Promise( ( resolve, reject ) => {
        strapi
        .get( `events/count` )
        .then( result => resolve( result.data ) )
        .catch( error => reject( error ) )
      } ) 
    },

    getAll: () => { 
      logger.info( `API`, `Fetching events.` )
      return new Promise( ( resolve, reject ) => {
        strapi
        .get( `events` )
        .then( result => {
          const events = result.data.data
          for ( let e = 0; e < events.length; e ++ ) {
            events[e] = { ...events[e], ...events[e].attributes }
            delete events[e].attributes
          }
          resolve( events )
        } )
        .catch( error => reject( error ) )
      } ) 
    },

    get: slug => { 
      logger.info( `API`, `Fetching event ${ slug }.` )
      return new Promise( ( resolve, reject ) => {
        strapi
        .get( `events/${ slug }` )
        .then( result => {
          const 
            data  = result.data.data,
            event = { ...data, ...data.attributes }
          delete event.attributes
          resolve( event )
        } )
        .catch( error => reject( error ) )
      } ) 
    }
  },
  
  viewers = { 

    get: uuid => { 
      return new Promise( ( resolve, reject ) => 
        strapi 
        .get( `viewers`, { params: { uuid } } )
        .then( result => resolve( result.data ) )
        .catch( error => reject( error ) )
      ) 
    } 
    
  },

  service = new Service( strapi )


// Here we inject two middleware functions into 
// axios so that we can monitor our network activity
// and report to the vuex store.

service.register( {


  // Reporting data sent (in the form of axios requests)

  onRequest( request ) {
    store.dispatch( 'network/add_bytes_sent', { 
      to    : 'api',
      bytes : network.api.get_bytes_sent( request )
    } )
    return request
  },


  // Reporting data received (in the form of responses)
  
  onResponse( response ) {
    store.dispatch( 'network/add_bytes_received', { 
      from  : 'api',
      bytes : network.api.get_bytes_received( response )
    } )
    return response
  }

} )

const


  assets = {

    head( asset ) {
      return new Promise( ( resolve, reject ) => 
        axios
        .head( asset )
        .then( result => resolve( result ) )
        .catch( error => reject( error ) )
      ) 

    }

  },

  service2 = new Service( axios )


// Here we inject two middleware functions into 
// axios so that we can monitor our network activity
// and report to the vuex store.

service2.register( {


  // Reporting data sent (in the form of axios requests)

  onRequest( request ) {
    store.dispatch( 'network/add_bytes_sent', { 
      to    : 'assets',
      bytes : network.api.get_bytes_sent( request )
    } )
    return request
  },


  // Reporting data received (in the form of responses)

  onResponse( response ) {
    store.dispatch( 'network/add_bytes_received', { 
      from  : 'assets',
      bytes : network.api.get_bytes_received( response )
    } )
    return response
  }

} )
  

export default {
  meta,
  livestream,
  events,   
  viewers,
  assets,
}
