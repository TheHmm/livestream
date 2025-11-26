<script>
import api from '@/api'
import { mux } from '@/utils/livestream'
import { mapGetters } from 'vuex'
export default {
  name: 'Preview',
  data() {
    return {
      url: undefined,
      image_data: undefined
    }
  }, 
  computed: {
    ...mapGetters( 'events', [
      'preview_event',
      'preview_time'
    ]),
    styles() {
      return this.preview_event?.styles || { '--h': 0, '--s': 0, '--l': 0 }
    },
    mux_recording() {
      return this.preview_event?.mux_recording
    },
    duration() {
      return this.mux_recording?.duration
    },
    playback_id() {
      if ( this.mux_recording && this.mux_recording?.tracks?.find( t => t.type == 'video' ) ) {
        return this.mux_recording?.playbackId
      } else {
        return null
      }
    },
    desired_time() {
      return this.preview_time && this.preview_time * this.duration
    },
    formatted_desired_time() {
      return this.desired_time && this.$time.dur_format( this.desired_time * 1000 )
    },
    formatted_duration_time() {
      return this.duration && this.$time.dur_format( this.duration * 1000 )
    },

  },
  watch: {
    desired_time() {
      this.reload_image()
    }
  },
  methods: {
    reload_image() {
      if ( this.playback_id && this.desired_time ) {
        this.url = this.source_url()  
        api
        .get( this.url, { responseType: 'blob' } )
        .then( res => this.image_data = this.image_src( res.data ) )
      }
    },
    source_url() {
      return mux.thumb_src( this.playback_id, this.desired_time )
    },
    image_src( data ) {
      return window.URL.createObjectURL( data )
    },
  }
}
</script>
<template>
  <div 
    :id="$id()"
    v-if="playback_id && desired_time"
  >
    <img 
       v-if="image_data"
      :style="{ ...styles }"
      :src="image_data"
      :title="`Thumbnail of livestream at ${ formatted_desired_time }`"
      :alt="`Thumbnail of livestream at ${ formatted_desired_time }`"
    />
    <span>
      <time>{{ formatted_desired_time }}</time> / 
      <time>{{ formatted_duration_time }}</time>
    </span>
  </div>
</template>
<style scoped>
#preview {
  position: absolute;
  /* top: 0; */
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
#preview img {
  transition: box-shadow var(--fast) linear;
  box-shadow: 0 0 15px 0px var(--accent);
}
</style>
