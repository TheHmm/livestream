import time from './time'

const

  // Constructing the appropriate URLs with mux for the
  // different players.

  mux = {

    get_cur_time( livestream ) {
      if ( livestream.start_time ) {
        return ( time.now() - livestream.start_time ) / 1000
      } else {
        return 0.5
      }
    },

    source_url( playback_id, mode, curr_time ) {
      if ( mode == 'thumbs' ) {
        return this.thumb_src( playback_id, curr_time )
      } else if ( mode == 'audio' ) {
        return this.audio_src( playback_id )
      } else {
        return this.video_src( playback_id )
      }
    },

    thumb_src( playback_id, curr_time ) {
      return `https://image.mux.com/${ playback_id }/thumbnail.jpg?&width=300&time=${ curr_time }`
    },

    video_src( playback_id ) {
      return `https://stream.mux.com/${ playback_id }.m3u8`
    },

    audio_src( playback_id ) {
      return `https://stream.mux.com/${ playback_id }.m3u8?add_audio_only=true`
    },

    text_src( playback_id, track_id ) {
      return `https://stream.mux.com/${ playback_id }/text/${ track_id }.vtt`
    }

  },


  // Checking if hls.js is supported without importing the
  // whole library and using Hls.isSupported(). Copied and
  // refactored from: /hls.js/src/is-supported.ts

  hls_is_supported = () => {

    const
      mediaSource  = self.MediaSource || self.WebKitMediaSource,
      sourceBuffer = self.SourceBuffer || self.WebKitSourceBuffer

    if (!mediaSource) {
      return false
    }

    const isTypeSupported =
      mediaSource &&
      typeof mediaSource.isTypeSupported === 'function' &&
      mediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')

    const sourceBufferValidAPI =
      !sourceBuffer || (sourceBuffer.prototype &&
      typeof sourceBuffer.prototype.appendBuffer === 'function' &&
      typeof sourceBuffer.prototype.remove === 'function')

    // console.log( 'mediaSource: ', mediaSource )
    // console.log( 'sourceBuffer', sourceBuffer )
    // console.log( 'isTypeSupported', isTypeSupported )
    // console.log( 'sourceBufferValidAPI', sourceBufferValidAPI )

    return !!isTypeSupported && !!sourceBufferValidAPI

  }

export {
  mux,
  hls_is_supported
}

export default {
  mux,
  hls_is_supported
}
