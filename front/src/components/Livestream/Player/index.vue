<script>

import { logger }     from '@/utils'
import { livestream } from '@/utils'
import Captions       from './Captions.vue'
import Timer          from './Timer.vue'



export default {
  
  name: 'Player',

  components: { Captions, Timer },
  
  props: {
    livestream: { type: Object },
  },

  computed: {
    active() { 
      return this.livestream.status == 'active' 
    },
    stream_start() {
      return this.livestream.start_time
    },
    mode() {
      return this.$store.getters['livestream/current_mode']( this )
    }
  },

  data() {
    return {
      player : null,
      should_update: false,
    }
  },

  watch: {

    livestream() {
      if ( this.active ) {
        this.should_update = true
      } else {
        this.destroy()
      }
    },
    mode( new_mode, old_mode ) {
      // console.log(old_mode.id, new_mode.id)
      if ( old_mode.hls && !new_mode.hls ) {
        this.$store.commit('livestream/RESET_MODES')
      } else if ( old_mode.hls && new_mode.hls ) { 
        this.$store.commit('livestream/DELETE_MODE', 'video')
        this.player.player.currentLevel = new_mode.id
      } else {
        this.should_update = true
      }
    },

  },

  created() {
  },

  async mounted() {
    this.create()
    await this.init()
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

    async init() {
      if ( this.player ) {
        logger.info( 'LIVESTREAM', `Initializing player.` )
        await this.player.init()
      } else {
        logger.error('LIVESTREAM', `Can't play livestream!`)
      }
    },


    // We destroy our player. When we want to create a new one
    // or clean up before unmounting.

    destroy() {
      logger.info( 'LIVESTREAM', `Destroying player.` )
      if ( this.player ) {
        this.player.destroy()
      }
      this.player = null
    },

    
    // When something changes in the livestream or mode, we 
    // destroy the old player, create a new one and initiate it,
    
    async update() {
      this.destroy()
      this.create()
      await this.init()
    },


    // Create the appropriate player for the livestream type
    // and mode.

    create() {

      logger.info( 'LIVESTREAM', `Creating player for ${ this.mode.name }.` )


      // We only load the captions player + the time display

      if ( this.mode.name == 'transcript') {
        
      

      // The image player will load a thumbnail every X seconds
      // as well as subscribe to a subtitle stream from Marco.

      } else if ( this.mode.name == 'thumbs' ) {
        this.player = livestream.players.img_player(
          this.$refs.img, 
          this.livestream,
          this.mode.name,
          this.$socket
        )


      // Else, we default to a <video> or <audio> tag (that is 
      // conditionally created by vue in the template). If hls.js 
      // is supported in the browser, we instantiate it with the
      // the <video> or <audio> element.

      } else if ( livestream.hlsIsSupported() ) {
        this.player = livestream.players.hls_player( 
          this.$refs.media, 
          this.livestream,
          this.mode.name,
          this.$socket
        )


      // If the <video> or <audio> tag supports HLS natively, 
      // which is the case for some browsers, we just set the
      // elements source as we would with any non-m3u8 URL.

      } else if ( this.$el.canPlayType( 'application/vnd.apple.mpegurl' ) ) {
        this.player = livestream.players.def_player(
          this.$refs.media, 
          this.livestream,
          this.mode.name
        )
      }

    },


  }



}

</script>

<template>

  <div
    :id="$id()"
    aria-label="livestream player"
  >
    <div
      id="low_res_player"
      v-if="mode.name == 'thumbs' || mode.name == 'transcript'"
      aria-label="thumbnail player"
    > 
      <!-- <Timer
        :stream_start="stream_start"
      /> -->
      <img
        v-if="mode.name == 'thumbs'"
        ref="img"
        :alt="`Thumbnail of live stream at `"
      />
      <Captions 
        :native="false"
      />      
    </div>

    <audio
      v-else-if="mode.name == 'audio'"
      muted
      controls
      autoplay
      aria-label="audio player"
      ref="media"
    >
    </audio>

    <video
      v-else
      muted
      controls
      autoplay
      aria-label="video player"
      ref="media"
    >
      <Captions 
        :player="player"
        :stream_start="stream_start"
        :native="true"
      />
    </video>
    
    

  </div>

</template>

<style>

#player {
  width: 100%;
  display: flex;
}

video,
audio,
#low_res_player
 {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

#low_res_player {
  display: flex;
}

.captions {
  max-height: 300px;
  overflow: scroll;
}

.mobile video {
  object-fit:unset;
  height: unset;
}
</style>
