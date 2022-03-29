<script>
import { hls_is_supported } from '@/utils/livestream'
import $log                 from '@/utils/log'
import Captions             from './Captions.vue'
import Thumbs               from './Thumbs.vue'
import HlsMedia             from './HlsMedia.vue'
import NativeMedia          from './NativeMedia.vue'


// Player component. This componet mouts the corrrect player
// based on the selected view mode

export default {
  
  name: 'Player',


  // These components are manually mounted in the <Component /> 
  // slot based on desired mode.

  components: { 
    Captions,
    Thumbs,
    HlsMedia,
    NativeMedia,
  },
  
  props: {
    livestream : Object,
  },

  computed: {


    // Computes the current mode by checking the route query
    // and defaults 'video' mode with automatic quality.

    mode() {
      return this.$store.getters['livestream/current_mode']( this )
    },


    // Computes wether closed captions are desired from the
    // route query and defaults to true.

    desires_captions() {
      const 
        key = 'closed_captions',
        value = this.$route.query[key],
        default_value = this.$store.state.meta.ui[key].default
      
      if ( value ) {
        if ( value == 'true' ) {
          return true
        } else {
          return false
        }
      } else {
        return default_value
      }
    },

  },

  data() {
    return {
      player : null,
    }
  },


  // When the desired mode changes, updatet the player.

  watch: {
    mode( new_mode, old_mode ) {
      if ( new_mode.name != old_mode.name ) {
        this.update()
      }
    },
  },

  mounted() {
    this.update()
  },

  methods: {


    // Mount the appropriate player for the livestream type
    // and mode.

    update() {

      $log.info( 'LIVESTREAM', `Creating player for ${ this.mode.name }.` )

      // We only load the captions player + the time display

      if ( this.mode.name == 'transcript') {
        this.player = 'Captions'
      

      // The image player will load a thumbnail every X seconds
      // as well as subscribe to a subtitle stream from Marco.

      } else if ( this.mode.name == 'thumbs' ) {
        this.player = 'Thumbs'


      // Else, we default to a <video> or <audio> tag (that is 
      // conditionally created by vue in the template). If hls.js 
      // is supported in the browser, we instantiate it with the
      // the <video> or <audio> element.

      } else if ( hls_is_supported() ) {
        this.player = 'HlsMedia'


      // If the <video> or <audio> tag supports HLS natively, 
      // which is the case for some browsers, we just set the
      // elements source as we would with any non-m3u8 URL.

      } else if ( this.$refs.tester.canPlayType( 'application/vnd.apple.mpegurl' ) ) {
        this.player = 'NativeMedia'
      }

    },


  }



}

</script>

<template>
  <div
    :id="$id()"
    :class="mode.name"
    aria-label="livestream player"
  >

    <Component 
      :is="player" 
      :livestream="livestream"
      :mode="mode"
      :desires_captions="desires_captions"
    />

    <video 
      id="tester"
      ref="tester"
    ></video>

  </div>
</template>

<style>

#player {
  width           : 100%;
  display         : flex;
}

#player.transcript,
#player.thumbs,
#player.audio {
  border          : var(--border);
  flex-direction  : column;
  justify-content : stretch;
  height          : 100%;
}

#player.audio {
  justify-content : center;
  align-items     : center;
}

#player .controls {
  display         : flex;
  align-items     : center;
  justify-content : space-around;
}

video {  
  width           : 100%;
  max-width       : 100%;
  max-height      : 100%;
  object-fit      : contain;
}

#tester {
  display: none;
}

.mobile video {
}
</style>
