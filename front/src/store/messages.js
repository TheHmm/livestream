import api from '@/api'
import { time } from '@/utils'
import { logger } from '@/utils'

export default {

  namespaced: true,

  state: {
    messages : {},
  },

  mutations: {
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

    messages_with_links : ( state, getters ) => {
      return (
        getters
        .messages_array
        .filter( m => m.links )
      )
    },
    
    my_id : ( state, getters, rootState, rootGetters ) => {
      return rootGetters['viewers/my_id']
    },

    get_viewer_by_id : ( state, getters, rootState, rootGetters ) => id => {
      return rootGetters['viewers/get_viewer_by_id']( id )
    },

    current_event_id : ( state, getters, rootState, rootGetters ) => {
      return rootGetters['events/current_event_id']
    },


  },

  actions: {


    // Process and set message

    set_message( { commit, getters }, message ) {
      const sender = message.sender?.data?.id || message.sender
      message.sender = getters.get_viewer_by_id( sender )
      commit( 'SET_MESSAGE', message )
    },

     // Fetch messages by event id 

     fetch_messages( { dispatch }, event_id ) { 
      return new Promise( ( resolve, reject ) => 
        api
        .messages
        .get_by_event( event_id )
        .then( messages => { 
          for ( const message of messages ) {
            dispatch( 'set_message', message )
          }
          resolve( messages ) 
        } )
        .catch( error => 
          reject( error ) 
        )
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


    // Create a message.

    async create_message( { getters, dispatch }, body ) {
      return new Promise( ( resolve, reject ) => 
        api
        .messages
        .post({ 
            body, 
            time: time.now(),
            sender: getters.my_id,
            event: getters.current_event_id 
        }) 
        .then( message => {
          // dispatch( 'register', viewer )
          resolve( message ) 
        } )
        .catch( error => reject( error ) )
      ) 
    },


    // Censoring messages.

    async censor( { getters }, message ) {
      try {
        await api.messages.put( message.id, {
          censored: !message.censored,
        })
      } catch ( error ) {
        throw error
      }
    },  


    socket_message( { dispatch }, message ) {
      logger.info( 'SOCKET', `Message ${ message.body }` )
      dispatch( 'set_message', message )
    },
    
    // socket_count({ commit }, count) {
    //   commit('setCount', count)
    // },


    delete_message( state, message ) {
      this._vm.$socket.client.emit('message', {
        time: message.time,
        deleted: true 
      })
    },



  }

}
