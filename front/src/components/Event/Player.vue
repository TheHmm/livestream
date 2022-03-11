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

    mode: {
      type: Object
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
    ...mapState('livestream', [ 
      'cc_interim',
      'cc',
      'track',
    ] ),
    track_src() {
      console.log(this.track)
      const tracks = this.player.player.subtitleTracks
      // tracks[0] = this.track
      console.log(tracks)
      return this.track
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
      // console.log(old_mode.name, new_mode.name)
      if ( old_mode.hls && !new_mode.hls ) {
        this.$store.commit('livestream/RESET_MODES')
      } else if ( old_mode.hls && new_mode.hls ) { 
        this.player.player.currentLevel = new_mode.id
      } else {
        this.should_update = true
      }
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


      // The image player will load a thumbnail every X seconds
      // as well as subscribe to a subtitle stream from Marco.

      if ( this.mode.name == 'thumbs' ) {
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
          this.$el,
          this.livestream,
          this.mode.name,
          this.$socket
        )


      // If the <video> or <audio> tag supports HLS natively, 
      // which is the case for some browsers, we just set the
      // elements source as we would with any non-m3u8 URL.

      } else if ( this.$el.canPlayType( 'application/vnd.apple.mpegurl' ) ) {
        this.player = livestream.players.def_player(
          this.$el,
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
    id="img_player"
    v-if="mode.name == 'thumbs'"
  > 
    <img
      ref="img"
    />
    <div class="captions">
      <p
        v-for="(caption, id) of cc"
        :key="id"
        class="caption"
      >
      {{ caption.text }}
      </p>
      <p
        v-if="cc_interim"
        class="caption"
      >
        {{ cc_interim.text }}
      </p>
    </div>
  </div>
  <audio
    v-else-if="mode.name == 'audio'"
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
    <track
      v-if="track"
      default 
      srclang="en" 
      kind="captions" 
      label="English" 
      :src="track_src"
    />
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
