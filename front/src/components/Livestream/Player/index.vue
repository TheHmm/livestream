<script>

import { logger }           from '@/utils'
import { hls_is_supported } from '@/utils/livestream'
import Captions             from './Captions.vue'
import Thumbs               from './Thumbs.vue'
import HlsMedia             from './HlsMedia.vue'
import NativeMedia          from './NativeMedia.vue'

export default {
  
  name: 'Player',

  components: { 
    Captions,
    Thumbs,
    HlsMedia,
    NativeMedia,
  },
  
  props: {
    livestream: { type: Object },
  },

  computed: {
    mode() {
      return this.$store.getters['livestream/current_mode']( this )
    },
    desires_captions() {
      return this.$route.query['captions'] === 'true'
    },
  },

  data() {
    return {
      player : null,
    }
  },

  watch: {
    mode( new_mode, old_mode ) {
      if ( new_mode.name != old_mode.name ) {
        this.update()
      }
    },
  },

  created() {
    this.update()
  },

  methods: {


    // Mount the appropriate player for the livestream type
    // and mode.

    update() {

      logger.info( 'LIVESTREAM', `Creating player for ${ this.mode.name }.` )


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

      } else if ( this.$el.canPlayType( 'application/vnd.apple.mpegurl' ) ) {
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

  </div>
</template>

<style>

#player {
  width: 100%;
  /* display: flex; */
}

#player.transcript,
#player.thumbs,
#player.audio {
  border: 1px dashed var(--fore);
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#player.audio {
  align-items: center;
  justify-content: center;
}

input {
  color: black
}

#player .controls {
  display: flex;
  align-items: center;
  justify-content: space-around;
}




video {  
    width: 100%;
  /* height: 100%; */
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}


.mobile video {
  object-fit:unset;
  height: unset;
}
</style>
