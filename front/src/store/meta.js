import api from '@/api'

export default {

  namespaced: true,

  state: {

    meta : null,

    mobile: false,

    ui: {
      reduce_motion: {
        label: "reduce motion",
        default:  false,
      },
      reduce_depth: {
        label: "reduce depth",
        default: false,
      },
      closed_captions: {
        label: "closed captions",
        default: true
      }
    },

    muted: true,

    error: null,

  },

  mutations: {

    SET_META : ( state, meta ) => {
      state.meta = meta
    },

    SET_MOBILE : ( state, mobile ) => {
      state.mobile = mobile
    },

    SET_MUTED : ( state, muted ) => {
      state.muted = muted
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
        return (
          state.meta?.defaultMarquee ||
          "The Hmm Livestream || "
        )
    },

    about: state => {
      return state.meta?.about
    },

    censor_message: state => {
      return state.meta.censorMessage
    },

    ui: state => {
      return state.ui
    },

    get_default_value: state => key => {
      return state.ui[key].default
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
