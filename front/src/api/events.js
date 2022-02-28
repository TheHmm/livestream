import axios      from 'axios'
import config     from '@/config'
import store      from '@/store'
import { logger } from '@/utils'
import { time }   from '@/utils'


// Sanitizing 'events' type received from Strapi.
// Note that for each of these events, we add a 
// 'livestream' property that returns a different
// object based on when the event is happening.

const sanitize = event => {

    // hygiene!

    event = { 
      ...event, 
      ...event.attributes 
    }
    delete event.attributes

    // When is it ?

    event.is = {
      in_past   : () => time.is_in_past( event.ends ),
      in_future : () => time.is_in_future( event.starts ),
      soon      : () => time.is_soon( event.starts ),
    }

    // (1) soon: map to current livestream in store
    // (2) past: return recording of old stream
    // (3) else: return null; stream doesn't exist

    event.livestream = () => ( // <== this is a function!
      event.is.soon() ? 
        store.getters[ 'livestream/get_livestream' ] :
      event.is.in_past() ? {
        url    : event.recordingURL,
        status : event.recordingURL && 'active' || 'idle'
      } : null 
    )
    return event
    
}

export default {

  
  // This method counts our events before fetching them
  // See: back/src/api/event/controllers/event.js
    
  count() { 
    logger.info( `API`, `Counting events.` )
    return new Promise( resolve => {
      axios
      .get( `${ config.api_url }/events/count` )
      .then( result => resolve( result.data ) )
      .catch( error => logger.error( 'API', error ) )
    } ) 
  },

  
  // Fetch all events; sort in reverse chronological 
  // order (i.e. most recent event first).

  getAll() { 
    logger.info( `API`, `Fetching events.` )
    return new Promise( resolve => {
      axios
      .get( `${ config.api_url }/events`, { params: { 
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
          events[ e ] = sanitize( events[ e ] )
        }
        resolve( events )
      } )
      .catch( error => logger.error( 'API', error ) )
    } ) 
  },


  // Fetch event by slug. Non-standard implementation
  // See: back/src/api/event/controllers/event.js

  get( slug ) { 
    logger.info( `API`, `Fetching event ${ slug }.` )
    return new Promise( resolve => {
      axios
      .get( 
        `${ config.api_url }/events/${ slug }`, { params: { 
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
          const event = sanitize( result.data.data )
        resolve( event )
      } )
      .catch( error => logger.error( 'API', error ) )
    } ) 
  }

}
