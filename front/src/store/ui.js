import api from '../api'

export default {

  namespaced: true,

  state: {

    meta : null,

    mobile: false,
    
    options: {
      reduce_motion: "Reduce motion", 
      reduce_depth: "Reduce depth", 
    },

    error: null
  },

  mutations: {

    SET_META : ( state, meta ) => {
      state.meta = meta
    },

    SET_MOBILE : ( state, mobile ) => {
      state.mobile = mobile
    },

    SET_ERROR : ( state, error ) => {
      state.error = error
    }
    
  },

  getters: {

    meta: state => {
      return state.meta
    },

    default_marquee: state => {
      return state.meta.defaultMarquee
    },

    censor_message: state => {
      return state.meta.censorMessage
    },

    page_not_found_text: state => {
      return state.meta.pageNotFoundText
    }

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
