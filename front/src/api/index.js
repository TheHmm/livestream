import axios from 'axios'

axios
.defaults
.baseURL = import.meta.env.VITE_APP_API_URL

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
      return new Promise( ( resolve, reject ) => 
        axios
        .get( `livestream` )
        .then( result => resolve( result.data.data.attributes.publicData ) )
        .catch( error => reject( error ) )
      ) 
    } 
  },
    
  events = {

    getAll() { 
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
      console.info(`* API: Fetching event ${ slug }` )
      return new Promise( ( resolve, reject ) => {
        axios
        .get( `events/${ slug }` )
        // .get( `events?filters[slug][$eq]=${ slug }` )
        .then( result => {
          console.log(result)
          let event = result.data.data[0]
          event = { ...event, ...event.attributes }
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
