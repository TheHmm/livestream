<script>
import { mux } from '@/utils/livestream'

// The default 'native' player with a <video> or
// <audio> tag when the browser has support for 
// HLS playback natively.

export default {

  name: 'NativeMedia',

  props: {
    livestream : { type: Object },
    mode       : { type: Object }
  },

  computed: {
    playback_id() { 
      return this.livestream.playbackId 
    },
    source_url() { 
      return mux.source_url( this.playback_id, this.mode.name ) 
    }
  },  

  beforeUnmount() {
    this.$el.src = undefined
  },

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
