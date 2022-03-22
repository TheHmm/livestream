import api from "../api"
import { color } from '@/utils'
import { time } from '@/utils'
import router from '@/router'

export default {


  namespaced: true,

  state: {

    events: []

  },

  mutations: {

    SET_EVENT  : ( state, event )  => {
      const found = state.events.find( e => e.slug == event.slug )
      if ( found ) {
        state.events[ state.events.indexOf( found ) ] = {
          ...found,
          ...event,
        }
      } else {
        const index = state.events.findIndex( e => e.starts < event.starts )
        if ( index == -1 ) {
          state.events.push( event )  
        } else {
          state.events.splice( index, 0, event )
        }
      }
    },

  },

  getters: {

    get_events : state => state.events,

    get_event : state => slug => state
      .events
      .find( e => e.slug === slug )
    ,

    current_event : ( state, getters ) => 
      getters
      .get_event( 
        router
        .currentRoute
        ._value
        .params
        .slug 
      )
    ,

    get_event_slugs : state => state
      .events
      .map( e => e.slug )
    ,

  },

  actions: {


    set_event( { commit, rootGetters }, event ) {
      commit( 'SET_EVENT', sanitize( event, rootGetters ) )
    },


    // Fetch number of events

    fetch_events_count( ) { 
      return new Promise( ( resolve, reject ) => 
        api
        .events
        .count()
        .then( count => resolve( count ) )
        .catch( error => reject( error ) )
      ) 
    },


    // Fetch all events 

    fetch_events( { dispatch } ) { 
      return new Promise( ( resolve, reject ) => 
        api
        .events
        .getAll()
        .then( events => {
          for ( const event of events ) {
            dispatch( 'set_event', event )
          }
          resolve( events ) 
        } )
        .catch( error => reject( error ) )
      ) 
    },


    // Fetch single event

    fetch_event( { dispatch }, slug ) { 
      return new Promise( ( resolve, reject ) => 
        api
        .events
        .get(slug)
        .then( event => {
          dispatch( 'set_event', event )
          resolve( event ) 
        } )
        .catch( error => reject( error ) )
      ) 
    },


    // Get all events; always fetches event count from
    // Strapi to check if we have all of them. If not,
    // we fetch them.

    async get_events( { getters, dispatch } ) {

      const local_count = getters.get_events.length
      let remote_count

      try {
        remote_count = await dispatch( 'fetch_events_count' )
      } catch ( error ) {
        remote_count = local_count
      }

      if ( remote_count > local_count ) {
        return await dispatch( 'fetch_events' )
      } else {
        return getters.get_events  
      }

    },


    // Get single event; we only call this function
    // when we are requesting the full event details
    // (e.g. for the event page), so we first check if
    // we have those details before calling fetch.

    async get_event( { getters, dispatch }, slug ) { 
      const event = getters.get_event(slug)
      if ( event && event.viewers ) {
        return event
      } else {
        return await dispatch( 'fetch_event', slug ) 
      }
    },


    // Handle updates from strapi created in real
    // time during the event.

    socket_eventUpdate( { dispatch }, event ) {
      dispatch( 'set_event', event )
    }


  }


}



// Sanitizing 'events' type received from Strapi.
// Note that for each of these events, we add a 
// 'livestream' property that returns a different
// object based on when the event is happening.

function sanitize ( event, rootGetters ) {

  event.accent = color.hsl_to_css_vars(event.accent)

  // When is it ?

  event.is = {
    in_past   : () => time.is_in_past( event.ends ),
    in_future : () => time.is_in_future( event.starts ),
    soon      : () => time.is_soon( event.starts ),
  }

  // (1) soon: map to current livestream in store
  // (2) past: return recording of old stream
  // (3) else: return null; stream doesn't exist

  event.livestream = () => { 
    // this is a function returning a value!
    if ( event.is.in_past() ) {
      const 
        playbackId = event.recording?.data?.playback_id,
        status = playbackId && 'active' || 'idle'
      return { playbackId, status }
    } else {
      return rootGetters[ 'livestream/get_livestream' ] 
    }
  }


  // If the event is having a livestream then it
  // should also have a cover.
  
  // event.cover = () => {
  //   if ( event.livestream()?.playbackId ) {
  //     return livestream.mux.thumb_src( 
  //       event.livestream().playbackId, 
  //       10 
  //     )
  //   } else {
  //     return null
  //   }
  // }
  // console.log(event.slug, event.recording, event.livestream(), event.cover() )
  
  return event
}
