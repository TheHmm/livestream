import api from '../api'

export default {

  namespaced : true,

  state: {
    meta : null,
  },

  mutations: {
    SET_META : ( state, meta ) => {
      state.meta = meta
    },
  },

  getters: {

    meta: state => {
      return state.meta
    },

    default_marquee: state => {
      return state.meta.defaultMarquee
    },

  },

  actions: {

     // App meta-data such as titles and meta descriptions

     fetch_meta({ commit }) { return new Promise( ( resolve, reject ) => 
      api
      .meta
      .get()
      .then( meta => {
        commit( 'SET_META', meta )
        resolve( meta ) 
      } )
      .catch( error => reject( error ) )
    ) },

    async get_meta({ getters, dispatch }) {
      return getters.meta || await dispatch( 'fetch_meta' )
    },


  }

}
