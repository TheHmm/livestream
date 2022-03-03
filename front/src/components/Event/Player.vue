<script>
import Hls        from 'hls.js'
import { logger } from '@/utils'
import networking from '@/networking'

export default {
  name: 'Player',
  props: {
    livestream: {
      type: Object
    },
    level: {
      type: String
    }
  },
  data() {
    return {
      
    }
  },
  computed: {
    active() { return this.livestream.status === 'active' },
  },
  watch: {
    livestream(newState) {
      if (newState.status === 'active') {
        this.update_stream()
      } else {
        this.$el.src = undefined
      }
    },
    level() {
      logger.log(this.level)
    }

  },
  mounted() {
    this.update_stream()
  },
  methods: {

    video_src( playback_id ) {
      return `https://stream.mux.com/${ playback_id }.m3u8`
    },
    audio_src( playback_id ) {
      return `https://stream.mux.com/${ playback_id }.m3u8?add_audio_only=true`
    },
    thumb_src( playback_id, time ) {
      return `https://image.mux.com/${ playback_id }/thumbnail.jpg?time=${ time }`
    },

    source_url( playback_id, time ) {
      if ( this.selected_level == 'only_cc' ) {
        return this.thumb_src( playback_id, time ) 
      } else if ( this.selected_level == 'only_audio' ) {
        return this.audio_src( playback_id )
      } else {
        return this.video_src( playback_id )
      }
    },

    async update_stream() {

      logger.info( 'LIVESTREAM', `Updating stream.` )

      const
        player      = this.$el,
        playback_id = this.livestream.playbackId,
        source_url  = this.source_url( playback_id )

      // If HLS.js is supported on this platform

      if (Hls.isSupported()) {

        const hls = new Hls()
        hls.loadSource( source_url )
        hls.attachMedia( player )
        networking.watchers.stream_monitor.init(hls, Hls.Events)
        hls.on(Hls.Events.MANIFEST_PARSED, event => {
          player.play()
        })

      // If the player can support HLS natively

      } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src = source_url
        player.addEventListener('loadedmetadata', () => {
          player.play()
        })
      }

    }
  }
}
</script>

<template>
  <div
    v-if="level == 'only_cc'"
  > 
    Closed Captions
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
