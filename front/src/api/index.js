import axios from 'axios'
import config from '../config'
import { logger, network } from '../utils'
import { Service } from 'axios-middleware'

axios.defaults.baseURL = config.apiURL

const service = new Service(axios)

service.register({
  onResponse( response ) {
    console.log(response)

    const 
      data         = response.data,
      headers      = response.headers,
      request      = response.request,
      data_size    = +headers['content-length'] || data.length,
      header_size  = network.jsonSize(headers),
      request_size = network.jsonSize(request),
      sum_down     = data_size + header_size,
      sum_up       = request_size

    console.log(sum_down, sum_up, sum_down + sum_up )
    

    return response
  }
})


const
  
  meta = {
    get() { 
      return new Promise( async ( resolve, reject ) => 
        axios
        .get( `meta` )
        .then( result => resolve( result.data.data.attributes ) )
        .catch( error => reject( error ) )
      ) 
    } 
  },

  livestream = {
    get() { 
      logger.info( `API`, `Fetching livestream.` )
      return new Promise( ( resolve, reject ) => 
        axios
        .get( `livestream` )
        .then( result => resolve( result.data.data.attributes.publicData ) )
        .catch( error => reject( error ) )
      ) 
    } 
  },
    
  events = {

    count() { 
      logger.info( `API`, `Counting events.` )
      return new Promise( ( resolve, reject ) => {
        axios
        .get( `events/count` )
        .then( result => resolve( result.data ) )
        .catch( error => reject( error ) )
      } ) 
    },

    getAll() { 
      logger.info( `API`, `Fetching events.` )
      return new Promise( ( resolve, reject ) => {
        axios
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

    get( slug ) { 
      logger.info( `API`, `Fetching event ${ slug }.` )
      return new Promise( ( resolve, reject ) => {
        axios
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
    get( uuid ) { 
      return new Promise( ( resolve, reject ) => 
        axios 
        .get( `viewers`, { params: { uuid } } )
        .then( result => resolve( result.data ) )
        .catch( error => reject( error ) )
      ) 
    } 
  }
    
export default {
  meta,
  livestream,
  events,   
  viewers
}
