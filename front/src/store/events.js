import api from "../api"

export default {


  namespaced: true,

  state: {

    events: []

  },

  mutations: {


    SET_EVENTS : ( state, events ) => state.events = events,

    SET_EVENT  : ( state, event )  => {
      const found = state.events.find( e => e.slug == event.slug )
      if ( found ) {
        state.events[ state.events.indexOf( found ) ] = event
      } else {
        state.events.push( event )
      }
    },

  },

  getters: {

    get_events  : state => state.events,

    get_event   : state => slug => state.events.find( e => e.slug === slug ),

    event_slugs : state => state.events.map( e => e.slug )

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
          commit( 'SET_EVENTS', events )
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


    // Get single event

    async get_event( { getters, dispatch }, slug ) { 
      return (
        getters.get_event(slug) || 
        await dispatch( 'fetch_event', slug )
      ) 
    },


  }


}
