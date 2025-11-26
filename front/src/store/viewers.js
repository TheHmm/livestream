import {
  v4       as uuid_v4,
  validate as uuid_validate
}            from 'uuid'
import api   from '@/api'
import $log  from '@/utils/log'
import $time from '@/utils/time'
import $socket from '@/utils/socket'

export default {

  namespaced: true,


  // By the time the store is loaded, the current viewer's
  // UUID must exist: it is eithrr pulled from storafe or
  // created here on the spot.

  state: {
    viewers: {},
    uuid: localStorage.uuid || uuid_v4(),
    chat_authenticated : false,
    request_chat_registration : false,
  },

  mutations: {
    SET_VIEWERS: ( state, viewers ) => { state.viewers = viewers },
    SET_VIEWER: ( state, viewer ) => { state.viewers[viewer.uuid] = viewer },
    SET_UUID: ( state, uuid ) => { state.uuid = uuid },
    SET_CHAT_AUTHENTICATED: ( state, authenticated ) => { state.chat_authenticated = authenticated },
    set_request_chat_registration: ( state, val ) => { state.request_chat_registration = val }
  },

  getters: {

    get_viewers : state => {
      return state.viewers
    },

    viewers_array: state => {
      return Object.values( state.viewers )
    },

    connected_viewers : ( state, getters ) => {
      return getters.viewers_array.filter( v => v.connected )
    },

    count: ( state, getters ) => {
      return getters.connected_viewers.length
    },

    get_viewer : state => uuid => {
      return state.viewers[ uuid ]
    },

    get_viewer_by_id : ( state, getters ) => id => {
      return getters.viewers_array.find( v => v.documentId == id )
    },

    uuid : state => {
      return state.uuid
    },

    me : state => {
      return state.viewers[ state.uuid ]
    },

    my_id : state => {
      return state.viewers[ state.uuid ].documentId
    },

    is_me : state => viewer => {
      return state.uuid == viewer.uuid
    },

    blocked : ( state, getters ) => {
      return getters.me?.blocked
    },

    moderator : ( state, getters ) => {
      return getters.me?.moderator
    },

    my_events : ( state, getters ) => {
      return getters.me?.events
    },

    current_event_id : ( state, getters, rootState, rootGetters ) => {
      return rootGetters['events/current_event_id']
    },

    get_emoji : ( state, getters, rootState, rootGetters ) => {
      return rootGetters['events/get_emoji']
    },

    has_been_to_current_event : ( state, getters ) => {
      return getters.my_events?.includes( getters.current_event_id )
    },


  },

  actions: {


    // Process and set viewer

    set_viewer( { commit, getters }, viewer ) {

      // We can only follow throough with viewers that
      // have UUID. THe rest cause errors.

      if ( !viewer.uuid ) {
        return
      }


      // If the viewer exists in our store, than this
      // function was called to update it. We merge.

      const found = getters.get_viewer(viewer.uuid)

      if ( found ) {
        viewer = { ...found, ...viewer }
      }


      // For the events relation, strapi is sometimes
      // returinng ids and other times it gives objects. We
      // normalize to ids : [ '1 , '2', '3', ... ]

      viewer.events = viewer.events?.map( e => e && e.documentId ) || viewer.events

      commit( 'SET_VIEWER', viewer )

    },


    // Fetch viewers by event id

    fetch_viewers( { dispatch }, event_id ) {
      return new Promise( ( resolve, reject ) =>
        api
        .viewers
        .get_by_event( event_id )
        .then( viewers => {
          for ( const viewer of viewers ) {
            dispatch( 'set_viewer', viewer )
          }
          resolve( viewers )
        } )
        .catch( error => reject( error ) )
      )
    },


    // Get viewers by event id. If our current conection count
    // is <= 1 ( only ourselves ), then we go ahead and fetch
    // from strapi

    async get_viewers( { getters, dispatch }, event_id ) {
      if ( getters.count <= 1 ) {
        return await dispatch( 'fetch_viewers', event_id )
      } else {
        return getters.get_viewers
      }
    },


    // check if uuid or just normal strapi id then use the
    // appropriate api getter function for it.

    fetch_viewer( { dispatch }, uuid ) {
      let getter
      if ( uuid_validate( uuid ) ) {
        getter = 'get_by_uuid'
      } else {
        getter = 'get_by_id'
      }
      return new Promise( ( resolve, reject ) =>
        api
        .viewers[getter]( uuid )
        .then( viewer => {
          dispatch( 'set_viewer', viewer )
          resolve( viewer )
        } )
        .catch( error => reject( error ) )
      )
    },


    // Get viewer by uuid. Set to root for access elsehwere,
    // namely in the message area for when a sender is not
    // found in the current event.

    get_viewer: {
      root: true,
      async handler( { getters, dispatch }, uuid ) {
        return (
          getters.get_viewer(  uuid ) ||
          await dispatch( 'fetch_viewer', uuid )
        )
      }
    },

    // Create a viewer.

    async create_viewer( { getters, dispatch }, { name, lifetime } ) {
      const uuid    = getters.uuid
      const events  = [ getters.current_event_id ]
      const expires = lifetime === '' ? null : $time.now() + lifetime * 24 * 60 * 60 * 1000
      return new Promise( ( resolve, reject ) =>
        api
        .viewers
        .post({
          name,
          uuid,
          events,
          expires
        })
        .then( viewer => {
          dispatch( 'register', viewer )
          resolve( viewer )
        })
        .catch( error => reject( error ) )
      )
    },


    // Update viewer

    async update_viewer( { getters, dispatch }, { name, lifetime } ) {
      const uuid    = getters.uuid
      const expires = lifetime === '' ? null : $time.now() + lifetime * 24 * 60 * 60 * 1000
      return new Promise( ( resolve, reject ) =>
        api
        .viewers
        .put( getters.my_id, {
          name,
          uuid,
          expires
        })
        .then( viewer => {
          resolve( viewer )
        })
        .catch( error => reject( error ) )
      )
    },


    // We check that a user exists in Strapi before they are
    // given access to sending messages.

    async chat_authenticate( { state, commit, getters, dispatch } ) {


      // If we've previously been authenticated, no need to do
      // all of this.

      if ( state.chat_authenticated ) {
        return state.chat_authenticated
      }

      // First, we check if the visitor has previously sent
      // messages on this website (ie. they created a viewer).
      // If not, this is a completely new user.

      if ( !state.uuid ) {
        $log.info( 'AUTH', 'You are not registered yet.' )
        return
      }

      $log.info( 'AUTH', `Found UUID: ${ state.uuid }.` )


      // Then we fetch the viewer from the server. We do this
      // to populate the viewer's "events" relation, since we
      // don't know if they've chatted to this one.

      try {
        await dispatch( 'fetch_viewer', state.uuid )


        // If they haven't chatted been to this event, then
        // we update this in the server.

        if ( !getters.has_been_to_current_event ) {
          $log.info('AUTH', "You haven't been to this event.")
          await api.viewers.put( getters.my_id, {
            events: [
              ...getters.my_events,
              getters.current_event_id
            ],
          })
        }


        // We commit this to our state so we dont have to fetch
        // everytime.

        commit( 'SET_CHAT_AUTHENTICATED', true )
        $log.info( 'AUTH', `You're chat-authenticated!` )

        return state.chat_authenticated

      // The only possibile reason for the viewer to have a
      // UUID in their localStorage but it does not exist on
      // the server is that it was deleted. We return the
      // error so that we can create a new viewer.

      } catch ( error ) {
        if ( error.message == '404' ) {
          $log.info( 'AUTH', `You're not in our database.` )
          return
        } else {
          throw error
        }
      }

    },


    // Blocking viewer

    async block_viewer( {}, viewer ) {
      try {
        await api.viewers.put( viewer.documentId, {
          blocked: !viewer.blocked,
        })
      } catch ( error ) {
        throw error
      }
    },


    // Register viewer's uuid to local storage. The only
    // time this is called is after the viewer has been
    // saved to the database.

    // Else, uuid() is called on the next refresh and the
    // current one is lost.

    register( { commit }, viewer ) {
      commit( 'SET_UUID', viewer.uuid )
      localStorage.uuid = viewer.uuid
    },


    // Once we get confirmation of joining the room, we inform 
    // other people of our uuid, even if the viewer hasn't
    // been stored to the database, this way, all visitors
    // can see each other and send emoji.

    async socket_confirmJoinRoom({ state, dispatch }, { room }) {
      $log.info( 'SOCKET', `Confirm join room ${ room }.` )
      $socket.emit('viewer', {
        uuid: state.uuid,
      })
      await dispatch( 'chat_authenticate' )
    },


    // This event is received in two different cases :
    // 1. a veiwer connected to the socket server
    // 2. a viewer has been created / updated in the DB

    socket_viewer( { dispatch }, viewer ) {
      $log.info( 'SOCKET', `Viewer ${ viewer.uuid }` )
      dispatch( 'set_viewer', viewer )
    },


    // After a user has joined to the socket event-room,
    // they are sent an array of UUIDs that correspond to
    // all the connected sockets.

    // This is the sort of "outer circle" of connected viewers
    // that also includes those not yet registered. It allows
    // for sending / receiving emojis, feeling a vibe for how
    // many people are there, even if silently.

    socket_viewers( { dispatch }, uuids ) {
      $log.info( 'SOCKET', `Got connected viewers ${ uuids.length }` )
      for ( const uuid of uuids ) {
        dispatch( 'set_viewer',  {
          uuid,
          connected: true,
        })
      }
    },


    // Confirmation that we left the room

    async socket_confirmLeaveRoom({ }, { room }) {
      $log.info( 'SOCKET', `Confirm leave room ${ room }.` )
    },


    // When we receive emoji from the viewer, we convert
    // the payload into a viewer object and update the
    // viewer sender with the emoji. We clear the emoji
    // after some time.

    socket_emoji( { getters,  dispatch }, { uuid, group, emoji } ) {
      dispatch( 'set_viewer', {
        uuid,
        emoji: getters.get_emoji( group, emoji )
      })
      let timeout = 5000
      if ( emoji == 'hmmosphere' ) {
        timeout = 3 * timeout
      }
      setTimeout( () => {
        dispatch( 'set_viewer', {
          uuid,
          emoji: null
        })
      }, timeout )
    },


    // set x, y position

    socket_position( { dispatch }, { uuid, position } ) {
      dispatch( 'set_viewer', {
        uuid,
        position
      })
    }


  }

}
