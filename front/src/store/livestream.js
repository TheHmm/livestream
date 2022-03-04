import api from "../api"
import { logger } from "../utils"

export default {

  namespaced: true,

  state: {


    // Livestream object. This is the publicData
    // property of the full livestream single type 
    // in Strapi:

    // livestream: {
    //   playbackID: string (used to fetch from mux)
    //   status: string ("active" or "idle")
    // }

    livestream: null

  },

  mutations: {

    SET_LIVESTREAM : ( state, livestream ) => state.livestream = livestream,

  },

  getters: {

    get_livestream : state => state.livestream,

  },

  actions: {


    // Fetch livestream object, only the public data

    fetch_livestream( { commit } ) { 
      return new Promise( ( resolve, reject ) => 
        api
        .livestream
        .get()
        .then( livestream => {
          commit( 'SET_LIVESTREAM', livestream )
          resolve( livestream ) 
        } )
        .catch( error => reject( error ) )
      ) 
    },


    // Get livestream

    async get_livestream( { getters, dispatch } ) {
      return (
        getters.get_livestream || 
        await dispatch( 'fetch_livestream' )
      )
    },


    // Receiving livestream updates from Strapi via the custom
    // Socket server and committing the changes to store.

    socket_streamUpdate( { commit }, data ) {
      commit( 'SET_LIVESTREAM', data )
      logger.info( `SOCKET`, `Got livestream update: ${ data.status }` )
    },

    socket_confirmJoinCc( { commit }) {
      logger.info( 'SOCKET', `Subscribed to closed captions.`)
    },

    socket_confirmLeaveCc( { commit }) {
      logger.info( 'SOCKET', `Unsubscribed from closed captions.`)
    },

    socket_interm( { commit }, data ) {
      console.log(data)
    },



  }


}
