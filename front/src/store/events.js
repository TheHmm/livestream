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

    events : state => state.events,

    event  : state => slug => state.events.find(e => e.slug == slug),

  },

  actions: {


    // fetch all events 

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


    // fetch single event

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


    // get all events 

    async get_events( { getters, dispatch } ) { 
      return (
        getters.events.length 
        && getters.events 
        || await dispatch( 'fetch_events' )
      )
    },


    // get single event

    async get_event( { getters, dispatch }, slug ) { 
      return (
        getters.event(slug) || 
        await dispatch( 'fetch_event', slug )
      ) 
    },


  }


}
