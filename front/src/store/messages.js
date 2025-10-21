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
    SET_MESSAGE    : ( state, message ) => { state.messages[message.time] = message },
    DELETE_MESSAGE : ( state, message ) => { delete state.messages[message.time] },
  },

  getters: {

    get_messages : state => {
      return state.messages
    },
    
    messages_array : state => {
      return Object.values( state.messages )
    },
    
    message_by_id : ( state, getters ) => id => {
      return getters.messages_array.find( e => e.id == id )
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

    selected_message : ( state, getters ) => {
      return getters.messages_array.find( m => m.selected )
    }

  },

  actions: {


    // Process and set message

    async set_message( { commit, getters, dispatch }, message ) {

      const event_id = message.event?.data?.id || message.event
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

      const sender_id = message.sender?.data?.id || message.sender?.id || message.sender

      message.sender = function() {
        return getters.viewer_by_id( sender_id )
      }

      if ( !message.sender() ) {
        $log.warn( 'API', `Message belongs to this event but it's sender (${ sender_id }) doesn't.` )
        try {
          await dispatch( 'get_viewer', sender_id, { root: true } )
        } catch ( error ) {
          $log.error( error )
        }
      }

      let in_response_to_id = null

      if ( message.in_response_to ) {
        if ( !isNaN(message.in_response_to) ) {
          in_response_to_id = message.in_response_to
        } else if ( message.in_response_to.id ) {
          in_response_to_id = message.in_response_to.id
        } else if ( message.in_response_to.data ) {
          in_response_to_id = message.in_response_to.data.id
        }
        message.in_response_to = null
      }

      if ( in_response_to_id ) {
        message.in_response_to = function() {
          return getters.message_by_id( in_response_to_id )
        }

        // delay check/fetch for a few milliseconds until all messages are loaded

        setTimeout(async () => {
          if ( !message.in_response_to() ) {
            $log.warn( 'API', `Trigger message (${ in_response_to_id }) wasn't found locally, fetching.` )
            try {
              await dispatch( 'get_message', in_response_to_id )
            } catch ( error ) {
              $log.error( error )
            }
          }
        }, 250)

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


    // fetch single message by id

    fetch_message( { dispatch }, id ) {
      return new Promise( ( resolve, reject ) =>
        api
        .messages
        .get(id)
        .then( message => {
          dispatch( 'set_message', message )
          resolve( message )
        } )
        .catch( error => reject( error ) )
      )
    },


    // Get message by id.

    async get_message( { getters, dispatch }, id ) {
      const message = getters.message_by_id( id )
      if ( message ) {
        return message
      } else {
        return await dispatch( 'fetch_message', id )
      }
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
        event  : getters.current_event_id,
        in_response_to : getters.selected_message?.id 
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
        await api.messages.put( message.id, {
          censored: !message.censored,
          sender: message.sender().id,
        })
      } catch ( error ) {
        throw error
      }
    },


    // Deleting messages.

    async delete_message( {}, message ) {
      try {
        await api.messages.delete( message.id )
      } catch ( error ) {
        throw error
      }
    },


    // select message to reply to it
    
    select_message( { commit, getters, dispatch }, message ) {
      const selected_message = getters.selected_message
      if ( selected_message ) {
        dispatch( 'unselect_message', selected_message )
      }
      commit( 'SET_MESSAGE', { ...message, ...{ selected: true } } )
    },


    // unselect message to reply to it
    
    unselect_message( { commit }, message ) {
      commit( 'SET_MESSAGE', { ...message, ...{ selected: false } } )
    },


    // Receive messages in real time

    async socket_message( { dispatch }, message ) {
      $log.info( 'SOCKET', `Message ${ message.body }` )
      await dispatch( 'set_message', message )
    },

  }

}
