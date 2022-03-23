import api from '../api'
import { logger } from '../utils'

export default {

  namespaced: true,

  state: {
    viewers : {},
    uuid : localStorage.uuid ? localStorage.uuid : null,
    authenticated: false,
  },

  mutations: {

    SET_VIEWER : ( state, viewer ) => {
      state.viewers[viewer.uuid] = viewer
    },

    SET_UUID : ( state, uuid ) => {
      state.uuid = uuid
    },

    SET_AUTHENTICATED : ( state, authenticated ) => {
      state.authenticated = authenticated
    }

  },

  getters: {

    get_viewers : state => {
      return state.viewers
    },

    viewers_array: state => {
      return Object.values( state.viewers )
    },

    count: ( state, getters ) => {
      return (
        getters
        .viewers_array
        .length
      )
    },

    get_viewer : state => uuid => {
      return state.viewers[ uuid ]
    },

    uuid : state => {
      return state.uuid
    },

    me : state => {
      return state.viewers[ state.uuid ]
    },

    my_id : state => {
      return state.viewers[ state.uuid ].id
    },

    blocked : ( state, getters ) => {
      return getters.me.blocked
    },

    moderator : ( state, getters ) => {
      return getters.me.moderator
    },

    my_events : ( state, getters ) => {
      return getters.me.events.data.map( e => e.id )
    },

    current_event_id : ( state, getters, rootState, rootGetters ) => {
      return rootGetters['events/current_event_id']
    },

    has_been_to_current_event : ( state, getters ) => {
      return getters.my_events.includes( getters.current_event_id )
    }


  },

  actions: {


    // Fetch viewers by event id 

    fetch_viewers( { commit }, event_id ) { 
      return new Promise( ( resolve, reject ) => 
        api
        .viewers
        .get_by_event( event_id )
        .then( viewers => {
          for ( const viewer of viewers ) {
            commit( 'SET_VIEWER', viewer )
          }
          resolve( viewers ) 
        } )
        .catch( error => reject( error ) )
      ) 
    },


    // Get viewers by event id.

    async get_viewers( { getters, dispatch }, event_id ) {
      if ( getters.count < 1 ) {
        return await dispatch( 'fetch_viewers', event_id )
      } else {
        return getters.get_viewers  
      }
    },


    // Fetch viewer by uuid 

    fetch_viewer( { commit }, uuid ) { 
      return new Promise( ( resolve, reject ) => 
        api
        .viewers
        .get( uuid )
        .then( viewer => {
          commit( 'SET_VIEWER', viewer )
          resolve( viewer ) 
        } )
        .catch( error => reject( error ) )
      ) 
    },


    // Get viewer by  uuid.

    async get_viewer( { getters, dispatch }, uuid ) {
      return (
        getters.get_viewer(  uuid ) || 
        await dispatch( 'fetch_viewer', uuid )
      )
    },

    // Create a viewer.

    async create_viewer( { getters, dispatch }, name ) {
      return new Promise( ( resolve, reject ) => 
        api
        .viewers
        .post({ 
            name, 
            events: [ getters.current_event_id ] 
        }) 
        .then( viewer => {
          dispatch( 'register', viewer )
          resolve( viewer ) 
        } )
        .catch( error => reject( error ) )
      ) 
    },


    // We check that a user exists before they are given
    // access to sending messages.

    async authenticate( { state, commit, getters, dispatch } ) {


      // If we've previously been authenticated, no need to do
      // all of this.

      if ( state.authenticated ) {
        return state.authenticated
      }

      // First, we check if the visitor has previously sent
      // messages on this website (ie. they created a viewer).
      // If not, this is a completely new user.
      
      if ( !state.uuid ) {
        logger.info( 'AUTH', 'You are not registered yet.' )
        return
      }

      logger.info( 'AUTH', `You have a UUID: ${ state.uuid }.` )


      // Then we fetch the viewer from the server. We do this
      // to populate the viewer's "events" relation, since we
      // don't know if they've chatted to this one.

      try {
        await dispatch( 'fetch_viewer', state.uuid ) 


        // If they haven't chatted been to this event, then
        // we update this in the server.
        
        if ( !getters.has_been_to_current_event ) {
          logger.info('AUTH', 'You havent been to this event.')
          const { me, my_events, current_event_id } = getters
          try {
            await api.viewers.put( me.id, {
              events: [ ...my_events, current_event_id ],
            })

          
          // This is probably a server error

          } catch ( error ) {
            throw error
          }
        }
        

        commit( 'SET_AUTHENTICATED', true )
        logger.info( 'AUTH', `You're authenticated!` )

        return state.authenticated

      // The only possibile reason for the viewer to have a 
      // UUID in their localStorage but it does not exist on
      // the server is that it was deleted. We return the 
      // error so that we can create a new viewer.

      } catch ( error ) {
        if ( error.message == '404' ) {
          logger.info( 'AUTH', `You're not in our database.` )
          return
        } else {
          throw error
        }
      }

    },

    register( { commit }, viewer ) {
      commit( 'SET_UUID', viewer.uuid )
      localStorage.uuid = viewer.uuid
    },

    socket_connect( ) {
      logger.info( 'SOCKET', 'connect' )
    },

    socket_disconnect( ) {
      logger.info( 'SOCKET', 'disconnect' )
    },

    socket_viewer( { state, commit }, viewer ) {
      logger.info( 'SOCKET', `viewer ${ viewer.name }` )
      console.log(viewer)
      // commit('SET_VIEWER', viewer)
      // if (
      //   state.uuid &&
      //   viewer.uuid === state.uuid &&
      //   !state.isAdmin
      //   // user.uuid.includes(state.uuid.replace(user.name, '')) &&
      // ) {
      //   if (viewer.blocked) {
      //     logger.warn(`STORE`, 'blocked')
      //     commit('setBlock', true)
      //   } else {
      //     logger.warn(`STORE`, 'unblocked')
      //     commit('setBlock', false)
      //   }
      // } 
    },
    
    // socket_count({ commit }, count) {
    //   commit('setCount', count)
    // },


  }

}
