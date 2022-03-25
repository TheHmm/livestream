<script>
import { mux } from '@/utils/livestream'
import networking from '@/networking'
import Captions from './Captions.vue'
import Play from './Play.vue'
import Volume from './Volume.vue'
import Mute from './Mute.vue'


// The 'foreign' HLS player with a <video> or <audio>
// tag using hls.js and attaches the stream monitor to
// it. See: /front/src/networking/watchers.js:L120 .

export default {

  name: 'HlsMedia',

  components: {
    Captions,
    Play,
    Volume,
    Mute
  },


  props: {
    livestream       : { type: Object },
    mode             : { type: Object },
    desires_captions : { type: Boolean }
  },
 
  data() {
    return {
      hls : null,
      playing: false,
      muted: true,
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
    },
  },

  async created() {
    await this.init()
  },

  beforeUnmount() {
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
      this.hls.attachMedia( this.$refs.media )
      this.hls.on( Hls.Events.MANIFEST_PARSED, ( event, data ) => {
        if (this.mode.name == 'video') {
          this.levels_to_modes( data.levels )
        }
        this.play()
      })
      this.updating = false
    },

    play() {
      this.playing = true
      this.$refs.media.play()
    },

    pause() {
      this.playing = false
      this.$refs.media.pause()
    },

    mute() {
      this.muted = true
      this.$refs.media.muted = true
    },

    unmute() {
      this.muted = false
      this.$refs.media.muted = false
    },

    volume_up() {
      if ( this.$refs.media.volume < 1 ) {
        this.$refs.media.volume += 0.1
      }
    },
    
    volume_down() {
      if ( this.$refs.media.volume > 0 ) {
        this.$refs.media.volume -= 0.1
      }
    },

 
    destroy() {
      if ( this.hls ) {
        this.hls.destroy()
        this.hls = null
      }
      this.$store.commit('livestream/RESET_MODES')
    },

    levels_to_modes( levels ) {
      for ( let id = 0; id < levels.length; id ++ ) {
        this.$store.dispatch('livestream/create_mode_from_hls_level', {
          ...data.levels[id], 
          ...{ id }
        })
      }
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
    ref="media"
    muted
    controls
    autoplay
    aria-label="video player"
    :src="source_url"
  >
    <Captions 
      v-if="desires_captions"
      :hls="hls"
      :stream_start="stream_start"
    />
  </video>
  <section v-else>
    <div class="controls">
      <Play
        :playing="playing"
        @click="playing ? pause() : play() "
      />
      <Mute
        v-if="muted"
        :muted="muted"
        @click="muted ? unmute() : mute() "
      />
      <Volume
        direction="-"
        @click="this.volume_down()"
      />
      <Volume
        direction="+"
        @click="this.volume_up()"
      />
    </div>
    <audio
      muted
      autoplay
      ref="media"
      aria-label="audio player"
      :src="source_url"
    >
    </audio>
  </section>
</template>

<style scoped>

section {
  padding: 10%;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.controls {
  width: 100%;
}

</style>