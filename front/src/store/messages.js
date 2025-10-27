import api from '@/api'
import $log from '@/utils/log'
import $time from '@/utils/time'

export default {

  namespaced: true,

  state: {
    messages : {},
  },

  mutations: {
    SET_MESSAGES   : ( state, messages ) => { state.messages = messages },
    SET_MESSAGE    : ( state, message ) => { state.messages[message.documentId] = message },
    DELETE_MESSAGE : ( state, message ) => { delete state.messages[message.documentId] }
  },

  getters: {

    get_messages : state => {
      return state.messages
    },

    messages_array : state => {
      return Object.values( state.messages )
    },

    sorted_messages : ( state, getters ) => {
      return getters.messages_array.sort( ( a, b ) => {
        return new Date(a.time) - new Date(b.time)
      })
    },

    count: ( state, getters ) => {
      return getters.messages_array.length
    },

    chat_by_time : ( state, getters ) => {
      return getters.messages_array.sort( (a, b) => {
        return a.time - b.time
      })
    },

    messages_with_links : ( state, getters ) => {
      return getters.messages_array.filter( m => m.links )
    },

    my_id : ( state, getters, rootState, rootGetters ) => {
      return rootGetters['viewers/my_id']
    },

    blocked : ( state, getters, rootState, rootGetters ) => {
      return rootGetters['viewers/blocked']
    },

    viewer_by_id : ( state, getters, rootState, rootGetters ) => {
      return rootGetters['viewers/get_viewer_by_id']
    },

    current_event_id : ( state, getters, rootState, rootGetters ) => {
      return rootGetters['events/current_event_id']
    },

    censor_message : ( state, getters, rootState, rootGetters ) => {
      return rootGetters['meta/censor_message']
    },

  },

  actions: {


    // Process and set message

    async set_message( { commit, getters, dispatch }, message ) {

      const event_id = message.event?.documentId || message.event
      if ( event_id && event_id != getters.current_event_id ) {
        return
      }

      if ( message.deleted ) {
        commit( 'DELETE_MESSAGE', message )
        return
      }

      if ( message.censored ) {
        message.body = getters.censor_message
        message.links = null
        message.emoji = null
      }

      const sender_id = message.sender?.documentId || message.sender

      message.sender = function() {
        return getters.viewer_by_id( sender_id )
      }

      if ( !message.sender() ) {
        $log.warn( 'API', `Message belons to this event but it's sender (${ sender_id }) doesn't.` )
        try {
          await dispatch( 'get_viewer', sender_id, { root: true } )
        } catch ( error ) {
          $log.error( error )
        }
      }

      commit( 'SET_MESSAGE', message )
    },


    // Fetch messages by event id

    fetch_messages( { dispatch }, event_id ) {
      return new Promise( ( resolve, reject ) =>
        api
        .messages
        .get_by_event( event_id )
        .then( async messages => {
          for ( const message of messages ) {
            await dispatch( 'set_message', message )
          }
          resolve( messages )
        } )
        .catch( error =>
          reject( error )
        )
      )
    },

    // Fetch all messages with links from event

    fetch_all_event_messages( { dispatch }, event_id ) {
      return new Promise( ( resolve, reject ) =>
        api
        .messages
        .get_all_event_messages( event_id )
        .then( async messages => {
          for ( const message of messages ) {
            await dispatch( 'set_message', message )
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


    // Create a message. Blocked viewers will be prevented
    // from sending messages, but will be able to see their's
    // as being sent.

    async create_message( { getters, dispatch }, body ) {
      const message = {
        body   : body,
        time   : $time.now(),
        sender : getters.my_id,
        event  : getters.current_event_id
      }
      if ( getters.blocked ) {
        message.time = (new Date).toString()
        await dispatch( 'set_message', message )
        return message
      }
      return new Promise( ( resolve, reject ) => {
        api
        .messages
        .post( message )
        .then( message => resolve( message ) )
        .catch( error => reject( error ) )
      })
    },


    // Un/Censoring messages

    async censor_message( {}, message ) {
      try {
        await api.messages.put( message.documentId, {
          censored: !message.censored,
          sender: message.sender().documentId,
        })
      } catch ( error ) {
        throw error
      }
    },


    // Deleting messages.

    async delete_message( {}, message ) {
      try {
        await api.messages.delete( message.documentId )
      } catch ( error ) {
        throw error
      }
    },


    // Receive messages in real time

    async socket_message( { dispatch }, message ) {
      $log.info( 'SOCKET', `Message ${ message.body }` )
      await dispatch( 'set_message', message )
    },

  }

}
