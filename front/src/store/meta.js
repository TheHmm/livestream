import api from '@/api'

// App meta-data such as titles and meta descriptions, also
// other misc things such as UI accessibility options, global
// mute state, etc...

export default {
  namespaced: true,

  state: {
    meta    : null,
    mobile  : false,
    muted   : true,
    error   : null,
    ui      : {
      reduce_motion : { label: "reduce motion", default: false },
      reduce_depth  : { label: "reduce depth",  default: false },
    },
  },

  mutations: {
    SET_META   : ( state, meta )   => { state.meta = meta },
    SET_MOBILE : ( state, mobile ) => { state.mobile = mobile },
    SET_MUTED  : ( state, muted )  => { state.muted = muted },
    SET_ERROR  : ( state, error )  => { state.error = error }
  },

  getters: {
    meta: state => {
      return state.meta
    },
    default_marquee: state => {
      return state.meta?.defaultMarquee || "The Hmm Livestream || "
    },
    about: state => {
      return state.meta?.about
    },
    censor_message: state => {
      return state.meta?.censorMessage
    },
    ui: state => {
      return state.ui
    },
    get_default_value: state => key => {
      return state.ui[key].default
    }
  },

  actions: {

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

    handle_mobile({ commit }) {
      commit( 'SET_MOBILE', window.innerWidth < 700 )
      window.onresize = () => {
        commit( 'SET_MOBILE', window.innerWidth < 700 )
      }
    }

  }
}
