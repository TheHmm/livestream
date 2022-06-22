import api from "@/api"
import $log from '@/utils/log'

const DEFAULT_MODES = () => ({

  transcript: {
    id: -3,
    name: 'transcript',
    label: 'text'
  },
  thumbs: {
    id: -2,
    name: 'thumbs',
    label: 'low-low-res'
  },
  audio: {
    id: -1,
    name: 'audio',
    label: 'audio'
  },

  // the mode 'video' will be overridden if HLS.js is used

  video: {
    id: 0,
    name: 'video',
    label: 'video',
    video: true,
  },

})

export default {

  namespaced: true,

  state: {


    // Livestream object. This is the publicData property of
    // the full livestream single type in Strapi

    livestream: null,


    // Stream modes

    modes: DEFAULT_MODES(),

    // Captions

    cc_interim : null,
    cc         : [],

  },

  mutations: {

    SET_LIVESTREAM : ( state, livestream ) => state.livestream = livestream,

    SET_CC_INTERIM : ( state, caption ) => state.cc_interim = caption,
    SET_CC         : ( state, cc ) => state.cc = cc,
    ADD_CAPTION    : ( state, caption ) => state.cc.push ( caption ),
    CLEAR_CC       : state => state.cc = [],

    SET_MODE       : ( state, mode ) => state.modes[mode.name] = mode,
    SET_MODE_LABEL : ( state, { name, label } ) => state.modes[name].label = label,
    DELETE_MODE    : ( state, name ) => delete state.modes[name],

    RESET_MODES    : state => state.modes = DEFAULT_MODES()

  },

  getters: {

    get_livestream : state => state.livestream,

    modes          : state => state.modes,

    default_mode   : state => state.modes['video'],

    current_mode   : ( state, getters ) => self => (
      self.$route.query?.mode &&
      state.modes[self.$route.query.mode] ||
      getters.default_mode
    )

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


    create_mode_from_hls_level( { commit }, level ) {
      commit( 'SET_MODE', {
        id    : level.id,
        name  : level.attrs.RESOLUTION,
        label : level.attrs.RESOLUTION,
        video : true,
      })
    },


    // Receiving livestream updates from Strapi via the custom
    // Socket server and committing the changes to store.

    socket_streamUpdate( { commit }, data ) {
      commit( 'SET_LIVESTREAM', data )
      $log.info( `SOCKET`, `Got livestream update: ${ data.status }` )
    },


    // closed captions

    socket_confirmJoinCc( { commit }, cc ) {
      $log.info( 'SOCKET', `Subscribed to closed captions.`)
      commit( 'SET_CC', cc )
    },

    socket_confirmLeaveCc( { commit }) {
      $log.info( 'SOCKET', `Unsubscribed from closed captions.`)
    },

    socket_interm( { commit }, caption ) {
      commit( 'SET_CC_INTERIM', caption )
    },

    socket_final( { commit }, caption ) {
      commit( 'SET_CC_INTERIM', null )
      commit( 'ADD_CAPTION', caption )
    },

    socket_clearCc( { commit }, cc ) {
      commit( 'CLEAR_CC' )
    }



  }


}
