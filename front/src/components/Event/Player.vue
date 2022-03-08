<script>

import { mapState }   from 'vuex'
import { logger }     from '@/utils'
import { livestream } from '@/utils'



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
      if ( this.player ) {
        logger.info( 'LIVESTREAM', `Destroying player.` )
        this.player.destroy()
        this.player = null
      }
    },

    
    // When something changes in the livestream or level, we 
    // destroy the old player, create a new one and initiate it,
    
    async update() {
      this.destroy()
      this.create()
      await this.init()
    },


    // Create the appropriate player for the livestream type
    // and level.

    create() {

      logger.info( 'LIVESTREAM', `Creating player for ${ this.level }.` )


      // The image player will load a thumbnail every X seconds
      // as well as subscribe to a subtitle stream from Marco.

      if ( this.level == 'only_cc' ) {
        this.player = livestream.players.img_player(
          this.$refs.img, 
          this.livestream,
          this.level,
          this.$socket
        )


      // Else, we default to a <video> or <audio> tag (that is 
      // conditionally created by vue in the template). If hls.js 
      // is supported in the browser, we instantiate it with the
      // the <video> or <audio> element.

      } else if ( livestream.HlsIsSupported() ) {
        this.player = livestream.players.hls_player( 
          this.$el,
          this.livestream,
          this.level
        )


      // If the <video> or <audio> tag supports HLS natively, 
      // which is the case for some browsers, we just set the
      // elements source as we would with any non-m3u8 URL.

      } else if ( this.$el.canPlayType( 'application/vnd.apple.mpegurl' ) ) {
        this.player = livestream.players.def_player(
          this.$el,
          this.livestream,
          this.level
        )
      }

    },


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
