import api from "../api"

export default {

  namespaced: true,

  state: {
    livestream: null
  },

  mutations: {

    SET_LIVESTREAM : ( state, livestream ) => state.livestream = livestream,

  },

  getters: {

    livestream: state => state.livestream,

  },

  actions: {


    // fetch ivestream object, only the public data

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


    // get livestream

    async get_livestream( { getters, dispatch } ) {
      return (
        getters.livestream || 
        await dispatch( 'fetch_livestream' )
      )
    },


    socket_streamUpdate( { commit }, data ) {
      commit( 'SET_LIVESTREAM', data )
    },

  }


}
