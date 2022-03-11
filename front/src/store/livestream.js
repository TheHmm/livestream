import api from "../api"
import { logger } from "../utils"
import { captions } from "../utils"

const DEFAULT_MODES = () => ({

  captions: {
    id: -2,
    name: 'captions',
    label: 'captions'
  },
  thumbs: {
    id: -2,
    name: 'thumbs',
    label: 'thumbnails'
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
    hls: true,
  },

})

export default {

  namespaced: true,

  state: {


    // Livestream object. This is the publicData property of 
    // the full livestream single type in Strapi:

    // livestream: {
    //   playbackID : string (used to fetch from mux)
    //   status     : string ("active" or "idle")
    //   start_time : unix time string
    //   
    // }

    livestream: null,

    modes: DEFAULT_MODES(),

    cc_interim : null,
    cc         : {},
    track      : null,

  },

  mutations: {

    SET_LIVESTREAM : ( state, livestream ) => state.livestream = livestream,

    SET_CC_INTERIM : ( state, caption ) => state.cc_interim = caption,
    SET_CC         : ( state, caption ) => state.cc[caption.id] = caption,
    SET_TRACK      : ( state, track ) => state.track = track,

    SET_MODE       : ( state, mode ) => state.modes[mode.name] = mode,

    RESET_MODES    : state => state.modes = DEFAULT_MODES()

  },

  getters: {

    get_livestream : state => state.livestream,

    modes          : state => state.modes,

    default_mode   : state => state.modes['video'],

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
        hls   : true,
      })
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

    socket_interm( { commit }, caption ) {
      commit( 'SET_CC_INTERIM', caption )  
    },

    socket_final( { commit }, caption ) {
      commit( 'SET_CC_INTERIM', null )  
      console.log(captions.srt_to_vtt( caption.srt ))
      commit( 'SET_TRACK', captions.srt_to_vtt( caption.srt ) )
      delete caption.srt
      commit( 'SET_CC', caption ) 

    },



  }


}
