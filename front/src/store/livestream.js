import api from "@/api"
import $log from '@/utils/log'


// Livestream related states such as the livestream object,
// viewing modes, and close captions.

// VIEWING MODES: Can be changed by certain parts of the app.
// For example, when loading an HLS playlist, multiple video
// dimensions are available, so we adjust the list every time.
// The mode 'video' will be changed to 'auto' when other video
// modes are present.

// Also note: the current viewing mode is selected by changing
// the URL parameter 'mode' to the mode name (uncommitted)

function DEFAULT_MODES() { return {
  transcript : { id: -3, name: 'transcript', label: 'text' },
  thumbs     : { id: -2, name: 'thumbs',     label: 'low-low-res' },
  audio      : { id: -1, name: 'audio',      label: 'audio' },
  video      : { id:  0, name: 'video',      label: 'video', video: true,},
}}

export default {

  namespaced: true,

  state: {
    livestream : null,
    modes      : DEFAULT_MODES(),
    cc_interim : null,
    cc         : [],
  },

  mutations: {
    SET_LIVESTREAM : ( state, livestream ) => state.livestream = livestream,
    SET_CC_INTERIM : ( state, cue ) => state.cc_interim = cue,
    SET_CC         : ( state, cc ) => state.cc = cc,
    ADD_CUE        : ( state, cue ) => state.cc.push ( cue ),
    CLEAR_CC       : ( state ) => state.cc = [],
    SET_MODE       : ( state, mode ) => state.modes[mode.name] = mode,
    SET_MODE_LABEL : ( state, { name, label } ) => state.modes[name].label = label,
    DELETE_MODE    : ( state, name ) => delete state.modes[name],
    RESET_MODES    : ( state ) => state.modes = DEFAULT_MODES()
  },

  getters: {
    get_livestream : ( state ) => state.livestream,
    modes          : ( state ) => state.modes,
    default_mode   : ( state ) => state.modes['video'],
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


    // Connvert hls.js level object to a mode and to our modes

    create_mode_from_hls_level( { commit }, level ) {
      commit( 'SET_MODE', {
        id    : level.id,
        name  : level.attrs.RESOLUTION,
        label : level.attrs.RESOLUTION,
        video : true,
      })
    },


    // Set the whole list of closed captions to a defined arr
    // of cues (used when pullling cues ddirectly from a vtt
    // file)

    set_CC ( { commit }, cc ) {
      console.log(cc)
      commit( 'SET_CC', cc )
    },


    // Receiving livestream updates from Strapi via the custom
    // Socket server and committing the changes to store.

    socket_streamUpdate( { commit }, data ) {
      commit( 'SET_LIVESTREAM', data )
      $log.info( `SOCKET`, `Got livestream update: ${ data.status }` )
    },


    // We can only received live CC updates if we are subscribed
    // to the cc socket channel.

    socket_confirmJoinCc( { commit }, cc ) {
      $log.info( 'SOCKET', `Subscribed to closed captions.`)
      commit( 'SET_CC', cc )
    },

    socket_confirmLeaveCc( { commit }) {
      $log.info( 'SOCKET', `Unsubscribed from closed captions.`)
    },

    socket_interm( { commit }, cue ) {
      console.log(cue)
      commit( 'SET_CC_INTERIM', cue )
    },

    socket_final( { commit }, cue ) {
      commit( 'SET_CC_INTERIM', null )
      commit( 'ADD_CUE', cue )
    },

    socket_clearCc( { commit }, cc ) {
      commit( 'CLEAR_CC' )
    }



  }


}
