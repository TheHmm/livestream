<script>
import { mux } from '@/utils/livestream'


// The default 'native' player with a <video> or
// <audio> tag when the browser has support for
// HLS playback natively.

export default {

  name: 'NativeMedia',

  props: {
    livestream       : Object,
    mode             : Object,
    muted            : Boolean,
    desires_captions : Boolean
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
    :muted="muted"
    controls
    autoplay
    playsinline
    aria-label="video player"
    :src="source_url"
  >
  </video>
  <audio
    v-else
    :muted="muted"
    controls
    autoplay
    playsinline
    aria-label="audio player"
    :src="source_url"
  >
  </audio>
</template>

<style scoped>


</style>
