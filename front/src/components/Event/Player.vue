<script>

import Hls          from 'hls.js'
import { logger }   from '@/utils'
import { mux }      from '@/utils'
import networking   from '@/networking'
import { mapState } from 'vuex'


export default {

  name: 'Player',

  props: {

    livestream: {
      type: Object
    },

    level: {
      type: String
    },

  },

  data() {
    return {
      hls_player : null,
      img_player : null,
      def_player : null
    }
  },

  computed: {
    active() { 
      return this.livestream.status == 'active' 
    },
    ...mapState('livestream', [ 'cc' ] )
  },

  watch: {

    livestream() {
      if ( this.active ) {
        this.update_stream()
      } else {
        this.destroy_player()
       
      }
    },

    level() {
      // logger.log('LIVESTREAM', this.level)
      this.level_changed = true
    }

  },

  created() {
  },

  mounted() {
    this.update_stream()
  },

  updated() {
    if (this.level_changed) {
      this.update_stream()
      this.level_changed = false
    }
  },

  methods: {

    update_stream() {


      // First, we destroy this current player if there is one.
      // Then we can set up the appropriate player.

      this.destroy_player()
      
      logger.info( 'LIVESTREAM', `Updating player: ${ this.level }` )


      // The image player will load a thumbnail every X seconds
      // as well as subscribe to a subtitle stream from Marco.

      if ( this.level == 'only_cc' ) {
        this.img_player = this.create_img_player(
          this.$refs.img, 
          this.livestream,
          this.level,
          this.$socket
        )
        this.img_player.init()


      // Else, we default to a <video> or <audio> tag (that is 
      // conditionally created by vue in the template). If hls.js 
      // is supported in the browser, we instantiate it with the
      // the <video> or <audio> element.

      } else if ( Hls.isSupported() ) {
        this.hls_player = this.create_hls_player( 
          this.$el,
          this.livestream,
          this.level
        )
        this.hls_player.init()


      // If the <video> or <audio> tag supports HLS natively, 
      // which is the case for some browser, we just set the
      // elements source as we would with any non-m3u8 URL.

      } else if ( this.$el.canPlayType( 'application/vnd.apple.mpegurl' ) ) {
        this.def_player = this.create_def_player(
          this.$el,
          this.livestream,
          this.level
        )
        this.def_player.init()


      // If for some reason, none of the above cases are met,
      // We throw an error.

      } else {
        logger.error('LIVESTREAM', `Can't play livestream!`)
      }

    },


    destroy_player() {
      if ( this.img_player ) {
        this.img_player.destroy()
      }
      if ( this.hls_player ) {
        this.hls_player.destroy()
      }
      if ( this.def_player ) {
        this.def_player.destroy()
      }
    },


    // Creates the image player. This uses mux's handy API
    // to get a thumbnail of the video at the current time
    // of the livestream's active assset. See line 70 here:
    // /back/src/api/mux-hook/controllers/mux-hook.js .

    create_img_player( element, livestream, level, socket ) {
     
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
        },

      }

    },


    // Creates the HLS player with a <video> or <audio>
    // tag using hls.js and attaches the stream monitor to
    // it. See: /front/src/networking/watchers.js:L120 .

    create_hls_player( element, livestream, level ) {

      return {
        
        playback_id : livestream.playbackId,
        player      : null,
 
        init() {
          const source_url = mux.source_url( this.playback_id, level )
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

    create_def_player( element, livestream, level ) {

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

  }


}

</script>

<template>
  <div
    v-if="level == 'only_cc'"
  > 
    <img
      ref="img"
    />
    <div class="captions">
      <p
        v-for="(caption, id) of cc"
        :key="id"
      >
      {{ caption }}
      </p>
    </div>
  </div>
  <audio
    v-else-if="level == 'only_audio'"
    muted
    controls
    autoplay
  >
  </audio>
  <video
    v-else
    muted
    controls
    autoplay
  >
  </video>
</template>

<style>
video {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
.mobile video {
  object-fit:unset;
  height: unset;
}
</style>
