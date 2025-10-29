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
  transcript : { id: -4, name: 'transcript', label: 'text' },
  thumbs     : { id: -3, name: 'thumbs',     label: 'low-low-res' },
  audio_th   : { id: -2, name: 'audio_th',   label: 'low-res' },
  audio      : { id: -1, name: 'audio',      label: 'audio' },
  video      : { id:  0, name: 'video',      label: 'video', video: true,},
}}

export default {

  namespaced: true,

  state: {
    livestreams : {},
    absolute_default_mode : 'video',
    modes      : DEFAULT_MODES(),
    cc_interim : null,
    cc         : [],
  },

  mutations: {
    SET_LIVESTREAM : ( state, livestream ) => state.livestreams[livestream.documentId] = livestream,
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
    get_livestreams : state => Object.values( state.livestreams ),
    get_livestream :  state => documentId => state.livestreams[documentId],
    get_livestream_by_event :  (state, getters) => event_id => {
      return getters.get_livestreams.find(s => s.events.includes( event_id ) )
    },
    current_livestream : ( state, getters, rootState, rootGetters ) => {
      return getters.get_livestream_by_event(rootGetters['events/current_event_id'])
    },
    modes : ( state ) => state.modes,
    default_mode : ( state, getters, rootState, rootGetters ) => {
      const current_event_default_mode =
        rootGetters['events/current_event_default_mode'] ||
        state.absolute_default_mode
      return state.modes[current_event_default_mode]
    },
    current_mode : ( state, getters ) => self => (
      self.$route.query?.mode &&
      state.modes[self.$route.query.mode] ||
      getters.default_mode
    )
  },

  actions: {


    set_livestream( { commit, getters, rootGetters }, livestream ) {

      console.log(livestream)

      if ( !livestream ) {
        const current_event = rootGetters['events/current_event']
        if ( current_event ) {
          livestream = { ...current_event.recording }
          livestream.documentId = 'livestream_' + current_event.documentId
          livestream.events = [ current_event.documentId ]
        }

      } else {

        const found = getters.get_livestream( livestream.documentId )
        if ( found ) {
          livestream = { ...found, ...livestream }
        }
        
        livestream.events = livestream.events.map( e => e.documentId )
        
        for ( const [key, value] of Object.entries(livestream.publicData)) {
          livestream[key] = value
        }
        delete livestream.publicData
        
      }
      commit( 'SET_LIVESTREAM', livestream )
    },

    // Fetch livestream object, only the public data

    fetch_livestream( { dispatch }, event_id ) {
      return new Promise( ( resolve, reject ) =>
        api
        .livestream
        .get_by_event( event_id )
        .then( livestream => {
          dispatch( 'set_livestream', livestream )
          resolve( livestream )
        } )
        .catch( error => reject( error ) )
      )
    },


    // Get livestream

    async get_livestream_by_event( { getters, dispatch }, event_id ) {
      return (
        getters.get_livestream_by_event( event_id ) ||
        await dispatch( 'fetch_livestream', event_id )
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
      commit( 'SET_CC', cc )
    },


    // Receiving livestream updates from Strapi via the custom
    // Socket server and committing the changes to store.

    socket_streamUpdate( { dispatch }, data ) {
      dispatch( 'set_livestream', data )
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
