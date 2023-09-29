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
  },

  computed: {
    playback_id() {
      return this.livestream.playbackId
    },
    source_url() {
      return mux.source_url( this.playback_id, this.mode.name )
    },
    desired_time() {
      return this.$route.query.time
    }
  },

  mounted() {
    if ( this.desired_time ) {
      this.set_time( this.desired_time )
    }
  },

  beforeUnmount() {
    this.$el.src = undefined
  },

  watch: {
    desired_time: {
      deep: true,
      immediate: true,
      handler( t ) {
        this.set_time( t )
      }
    }
  },

  methods: {
    set_time( t ) {
      if ( t && this.$el ) {
        console.log( `Setting time to ${ t } seconds.` )
        this.$el.currentTime = t
        this.$router.push( { query: { ...this.$route.query, ...{ time: undefined } } } )
      }
    },
  }


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
