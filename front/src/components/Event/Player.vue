<script>

import Hls          from 'hls.js'
import { mapState } from 'vuex'
import { logger }   from '@/utils'
import { mux }      from '@/utils'
import networking   from '@/networking'


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
      player : null,
      should_update: false,
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
        this.should_update = true
      } else {
        this.destroy()
      }
    },
    level() {
      this.should_update = true
    }

  },

  created() {
  },

  mounted() {
    this.create()
    this.init()
  },

  updated() {
    if (this.should_update) {
      this.update()
      this.should_update = false
    }
  },

  beforeUnmount() {
    this.destroy()
  },

  methods: {

    
    // If we successfully created either of the 3 players,
    // we can initialize it; else, ee throw an error.

    init() {
      if ( this.player ) {
        logger.info( 'LIVESTREAM', `Initializing player.` )
        this.player.init()
      } else {
        logger.error('LIVESTREAM', `Can't play livestream!`)
      }
    },


    // We destroy our player. When we want to create a new one
    // or clean up before unmounting.

    destroy() {
      if ( this.player ) {
        logger.info( 'LIVESTREAM', `Destroying player.` )
        this.player.destroy()
        this.player = null
      }
    },

    
    // When something changes in the livestream or level, we 
    // destroy the old player, create a new one and initiate it,
    
    update() {
      this.destroy()
      this.create()
      this.init()
    },


    // Create the appropriate player for the livestream type
    // and level.

    create() {

      logger.info( 'LIVESTREAM', `Creating player for ${ this.level }.` )

      // The image player will load a thumbnail every X seconds
      // as well as subscribe to a subtitle stream from Marco.

      if ( this.level == 'only_cc' ) {
        this.player = this.create_img_player(
          this.$refs.img, 
          this.livestream,
          this.level,
          this.$socket
        )


      // Else, we default to a <video> or <audio> tag (that is 
      // conditionally created by vue in the template). If hls.js 
      // is supported in the browser, we instantiate it with the
      // the <video> or <audio> element.

      } else if ( Hls.isSupported() ) {
        this.player = this.create_hls_player( 
          this.$el,
          this.livestream,
          this.level
        )


      // If the <video> or <audio> tag supports HLS natively, 
      // which is the case for some browser, we just set the
      // elements source as we would with any non-m3u8 URL.

      } else if ( this.$el.canPlayType( 'application/vnd.apple.mpegurl' ) ) {
        this.player = this.create_def_player(
          this.$el,
          this.livestream,
          this.level
        )
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
          networking.methods.head_asset( source_url )
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
    id="img_player"
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
video,
audio,
#img_player
 {
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
