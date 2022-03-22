import api from '../api'
import { logger } from '../utils'

export default {

  namespaced: true,

  state: {
    viewers : {},
    uuid : localStorage.uuid ? localStorage.uuid : null,
    blocked : false,
    moderator: false,
  },

  mutations: {

    SET_VIEWERS : ( state, viewers ) => {
      state.viewers = viewers
    },

    SET_VIEWER : ( state, viewer ) => {
      state.viewers[viewer.uuid] = viewer
    },

    SET_UUID : ( state, uuid ) => {
      state.uuid = uuid
    },

    SET_BLOCK : ( state, blocked ) => {
      state.blocked = blocked
    },

    SET_MODERATOR : ( state, moderator ) => {
      state.moderator = moderator
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
          commit( 'SET_VIEWERS', viewers )
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

    async create_viewer( { commit, dispatch }, { name, event_id } ) {
      return new Promise( ( resolve, reject ) => 
        api
        .viewers
        .post( { name, event_id } ) 
        .then( viewer => {
          dispatch( 'register', viewer )
          resolve( viewer ) 
        } )
        .catch( error => reject( error ) )
      ) 
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
    
    socket_viewerConfirm( { commit }, uuid ) {
      logger.info('STORE', 'Your User ID:', uuid )
    },

    // register( { state }, name ) {
    //   this._vm.$socket.client.emit( 'viewer', { 
    //     name,
    //     blocked: false,
    //   })
    // },

    // socket_count({ commit }, count) {
    //   commit('setCount', count)
    // },


  }

}
