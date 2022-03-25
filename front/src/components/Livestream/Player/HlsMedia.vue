<script>
import { mux } from '@/utils/livestream'
import networking from '@/networking'


// The 'foreign' HLS player with a <video> or <audio>
// tag using hls.js and attaches the stream monitor to
// it. See: /front/src/networking/watchers.js:L120 .

export default {

  name: 'HlsMedia',

  props: {
    livestream : { type: Object },
    mode       : { type: Object }
  },
 
  data() {
    return {
      hls : null,
      updating: false,
    }
  },

  computed: {
    playback_id() { 
      return this.livestream.playbackId 
    },
    stream_start() {
      return this.livestream.start_time
    },
    source_url() {
      return mux.source_url( this.playback_id, this.mode.name )
    }
  }, 
  
  watch: {
    async mode( new_mode, old_mode ) {
      if ( old_mode.video && new_mode.video && this.hls ) { 
        this.hls.currentLevel = new_mode.id
      } else if ( !this.updating ) {
        this.destroy()
        await this.init()
      }
    }
  },

  async created() {
    this.$socket.client.emit('join_CC_room')
    await this.init()
  },

  beforeUnmount() {
    this.$socket.client.emit('leave_CC_room')
    this.destroy()
  },

  methods: {

    async init() {
      this.updating = true
      const source_url = this.source_url
      const { default: Hls } = await import( 'hls.js' )
      this.hls = new Hls()
      this.init_stream_monitor( this.hls, Hls.Events )
      this.hls.loadSource( source_url )
      this.hls.attachMedia( this.$el )
      this.hls.on( Hls.Events.MANIFEST_PARSED, ( event, data ) => {
        if (this.mode.name == 'video') {
          for ( let l = 0; l < data.levels.length; l ++ ) {
            this.$store.dispatch('livestream/create_mode_from_hls_level', {
              ...data.levels[l], 
              ...{ id: l }
            })
          }
        }
        this.$el.play()
      })
      this.updating = false
    },
 
    destroy() {
      if ( this.hls ) {
        this.hls.destroy()
        this.hls = null
      }
      this.$store.commit('livestream/RESET_MODES')
    },

    init_stream_monitor( events ) {
      networking.watchers.stream_monitor.init( this.hls, events )
    },
    

  }

}

</script>

<template>
  <video
    v-if="mode.video"
    muted
    controls
    autoplay
    aria-label="video player"
    :src="source_url"
  >
    <!-- <Captions 
      :player="player"
      :stream_start="stream_start"
      :native="true"
    /> -->
  </video>
  <audio
    v-else
    muted
    controls
    autoplay
    aria-label="audio player"
    :src="source_url"
  >
    <!-- <Captions 
      :player="player"
      :stream_start="stream_start"
      :native="true"
    /> -->
  </audio>
</template>

<style scoped>


</style>
