import networking   from '@/networking'
import api          from '@/api'
import time         from './time'

const 

  players = {

    // Creates the image player. This uses mux's handy API
    // to get a thumbnail of the video at the current time
    // of the livestream's active assset. See line 70 here:
    // /back/src/api/mux-hook/controllers/mux-hook.js .

    img_player( element, livestream, level, socket ) {
     
      return {

        playback_id      : livestream.playbackId,
        player           : null,
        reload_every     : 5 * 1000,

        init() {
          socket.client.emit('join_CC_room')
          this.reload_img()
          this.player = setInterval(() => {
            this.reload_img()
          }, this.reload_every )
        },

        destroy() {
          socket.client.emit('leave_CC_room')
          if ( this.player ) {
            clearInterval( this.player )
          }
        },

        reload_img() {
          const
            curr_time  = mux.get_cur_time( livestream ),
            source_url = mux.source_url( this.playback_id, level, curr_time )
          element.src = source_url
          api.head( source_url )
        },

      }

    },


    // Creates the HLS player with a <video> or <audio>
    // tag using hls.js and attaches the stream monitor to
    // it. See: /front/src/networking/watchers.js:L120 .

    hls_player( element, livestream, level ) {

      return {
        
        playback_id : livestream.playbackId,
        player      : null,
 
        async init() {
          const source_url = mux.source_url( this.playback_id, level )
          const { default: Hls } = await import( 'hls.js' )
          this.player = new Hls()
          this.init_stream_monitor( this.player, Hls.Events )
          this.player.loadSource( source_url )
          this.player.attachMedia( element )
          this.player.on(Hls.Events.MANIFEST_PARSED, event => {
            element.play()
          })
          console.log(source_url)
        },

        destroy() {
          this.player.destroy()
        },

        init_stream_monitor( hls, events ) {
          networking.watchers.stream_monitor.init( hls, events )
        },

      }

    },


    // Creates the default player with a <video> or
    // <audio> tag when the browser has support for 
    // HLS natively.

    def_player( element, livestream, level ) {

      return {

        playback_id : livestream.playbackId,
        player      : null,   

        init() {
          const source_url = mux.source_url( this.playback_id, level )
          this.player = element
          this.player.src = source_url
          this.player.addEventListener('loadedmetadata', () => {
            this.player.play()
          })
        },

        destroy() {
          this.player.src = undefined
          this.player = null
        }

      }

    }


  },


  // Constructing the appropriate URLs with mux for the
  // different players. 

  mux = {
    
    get_cur_time( livestream ) {
      if ( livestream.start_time ) {
        return ( time.now() - livestream.start_time * 1000 ) / 1000
      } else {
        return 0.5
      }
    },
  
    source_url( playback_id, level, curr_time ) {
      if ( level == 'only_cc' ) {
        return this.thumb_src( playback_id, curr_time ) 
      } else if ( level == 'only_audio' ) {
        return this.audio_src( playback_id )
      } else {
        return this.video_src( playback_id )
      }
    }, 
  
    thumb_src( playback_id, curr_time ) {
      return `https://image.mux.com/${ playback_id }/thumbnail.jpg?&width=240&time=${ curr_time }`
    },
  
    video_src( playback_id ) {
      return `https://stream.mux.com/${ playback_id }.m3u8`
    },
    
    audio_src( playback_id ) {
      return `https://stream.mux.com/${ playback_id }.m3u8?add_audio_only=true`
    },

  },


  // Checking if hls.js is supported without importing the
  // whole library and using Hls.isSupported(). Copied and
  // refactored from: /hls.js/src/is-supported.ts

  hlsIsSupported = () => {

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

export default {
  mux,
  players,
  hlsIsSupported
}
