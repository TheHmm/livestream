import api from '../api'

export default {

  namespaced: true,

  state: {
    announcements: {}
  },

  mutations: {
    SET_ANNOUNCEMENT : ( state, announcement ) => {
      state.announcements[announcement.id] = announcement
    },
    DELETE_ANNOUNCEMENT : ( state, announcement ) => {
      delete state.announcements[announcement.id]
    },
  },

  getters: {
    announcements_array : state => {
      return Object.values( state.announcements )
    },
  },

  actions: {


    // Process and set announcement

    set_announcement( { commit, getters }, announcement ) {

      if ( announcement.deleted ) {
        commit( 'DELETE_ANNOUNCEMENT', announcement )
        return
      }
      
      commit( 'SET_ANNOUNCEMENT', announcement )
    },

    
    // Fetch announcements by event id 

    fetch_announcements( { dispatch }, event_id ) { 
      return new Promise( ( resolve, reject ) => 
        api
        .announcements
        .get_by_event( event_id )
        .then( announcements => { 
          for ( const announcement of announcements ) {
            dispatch( 'set_announcement', announcement )
          }
          resolve( announcements ) 
        } )
        .catch( error => 
          reject( error ) 
        )
      ) 
    },


    // Get announcements by event id.

    async get_announcements( { getters, dispatch }, event_id ) {
      return (
        getters.get_announcements ||
        await dispatch( 'fetch_announcements', event_id )
      )
    },

    
    // Receive announcements in real time

    socket_message( { dispatch }, message ) {
      logger.info( 'SOCKET', `Message ${ message.body }` )
      dispatch( 'set_message', message )
    },


  }

}
