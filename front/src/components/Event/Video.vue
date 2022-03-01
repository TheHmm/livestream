<script>
import Hls from 'hls.js'
import { logger } from '@/utils'

export default {
  name: 'Video',
  props: [
    'livestream',
  ],
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
        this.update_video()
      } else {
        this.$el.src = undefined
      }
    },

  },
  mounted() {
    this.update_video()
  },
  methods: {

    src: playbackId => `https://stream.mux.com/${playbackId}.m3u8?add_audio_only=true`,
    poster: playbackId => `https://image.mux.com/${playbackId}/thumbnail.jpg?time=15`,
// https://stream.mux.com/{PLAYBACK_ID}.m3u8?add_audio_only=true

    update_video() {

      logger.info( 'LIVESTREAM', `Updating video.` )

      const video = this.$el
      
      if (this.livestream.url) {
        this.$el.src = this.livestream.url
      } else {
    
        const playbackId = this.livestream.playbackId
        const sourceUrl = this.src(playbackId)
        // If HLS.js is supported on this platform

        if (Hls.isSupported()) {
          const hls = new Hls()
          hls.loadSource(sourceUrl)
          hls.attachMedia(video)
          hls.on(Hls.Events.FRAG_LOADING, (event, data ) => {
            // console.log(event, data)
          })
          hls.on(Hls.Events.FRAG_LOADED, ( event, data) => {
            // console.log(event, data.networkDetails, data)
            const   
              url = data.frag.baseurl,
              from = 'mux',
              bytes = data.frag.stats.loaded
            this.$store.dispatch( 'networking/add_bytes_received', { url, from, bytes } )
            logger.info( 'NETWORK', `${ bytes } bytes received from ${ from }.` )
          })
          hls.on(Hls.Events.MANIFEST_PARSED, event => {
            video.play()
          })


        // If the player can support HLS natively

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = sourceUrl
          video.addEventListener('loadedmetadata', () => {
            video.play()
          })
        }
      }

    }
  }
}
</script>

<template>
  <audio
    muted
    controls
    autoplay
  >
    <!-- <source /> -->
  </audio>
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
