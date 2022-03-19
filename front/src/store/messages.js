import api from '../api'

export default {

  namespaced: true,

  state: {
    messages : {},
  },

  mutations: {

    SET_MESSAGES : ( state, messages ) => {
      state.messages = messages
    },

    SET_MESSAGE : ( state, message ) => {
      state.messages[message.time] = message
    },
  },

  getters: {

    get_messages : state => {
      return state.messages
    },

    messages_array : state => {
      return Object.values( state.messages )
    },

    count: ( state, getters ) => {
      return (
        getters
        .messages_array
        .length
      )
    },

    chat_by_time : ( state, getters ) => {
      return (
        getters
        .messages_array
        .sort( (a, b) => a.time - b.time )
      )
    }, 

  },

  actions: {


     // Fetch messages by event id 

     fetch_messages( { commit }, event_id ) { 
      return new Promise( ( resolve, reject ) => 
        api
        .messages
        .get_by_event( event_id )
        .then( messages => {
          commit( 'SET_MESSAGES', messages )
          resolve( messages ) 
        } )
        .catch( error => reject( error ) )
      ) 
    },


    // Get messages by event id.

    async get_messages( { getters, dispatch }, event_id ) {
      if ( getters.count < 1 ) {
        return await dispatch( 'fetch_messages', event_id )
      } else {
        return getters.get_messages  
      }

    },

    delete_message( state, message ) {
      this._vm.$socket.client.emit('message', {
        time: message.time,
        deleted: true 
      })
    },

  }

}
