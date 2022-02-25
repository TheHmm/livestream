import axios      from 'axios'
import config     from '../config'
import { logger } from '../utils'
import store      from '../store'

const

  api_url = config.apiURL,
  
  meta = {

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

    count: () => { 
      logger.info( `API`, `Counting events.` )
      return new Promise( resolve => {
        axios
        .get( `${ api_url }/events/count` )
        .then( result => resolve( result.data ) )
        .catch( error => logger.error( 'API', error ) )
      } ) 
    },

    getAll: () => { 
      logger.info( `API`, `Fetching events.` )
      return new Promise( resolve => {
        axios
        .get( `${ api_url }/events` )
        .then( result => {
          const events = result.data.data
          for ( let e = 0; e < events.length; e ++ ) {
            events[e] = { ...events[e], ...events[e].attributes }
            delete events[e].attributes
          }
          resolve( events )
        } )
        .catch( error => logger.error( 'API', error ) )
      } ) 
    },

    get: slug => { 
      logger.info( `API`, `Fetching event ${ slug }.` )
      return new Promise( resolve => {
        axios
        .get( `${ api_url }/events/${ slug }` )
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
      if ( store.getters['network/is_registered_asset']( asset ) ) {
        logger.warn( 'API', `Not HEAD-ing registered url ${ asset }` )
        return
      }
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
