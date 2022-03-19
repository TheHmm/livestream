import api from "../api"

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

    get_event_slugs : state => state
      .events
      .map( e => e.slug )
    ,

  },

  actions: {


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

    fetch_events( { commit } ) { 
      return new Promise( ( resolve, reject ) => 
        api
        .events
        .getAll()
        .then( events => {
          for ( const event of events ) {
            commit( 'SET_EVENT', event )
          }
          resolve( events ) 
        } )
        .catch( error => reject( error ) )
      ) 
    },


    // Fetch single event

    fetch_event( { commit }, slug ) { 
      return new Promise( ( resolve, reject ) => 
        api
        .events
        .get(slug)
        .then( event => {
          commit( 'SET_EVENT', event )
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

    socket_eventUpdate( { commit }, event ) {
      commit( 'SET_EVENT', event )
    }


  }


}
