<script>
import { mux } from '@/utils/livestream'
import { time } from '@/utils'
import api from '@/api'
import Captions from './Captions.vue'


// The image / thumb player. This uses mux's handy API
// to get a thumbnail of the video at the current time
// of the livestream's active assset. See line 70 here:
// /back/src/api/mux-hook/controllers/mux-hook.js .

export default {

  name: 'Thumbs',

  components: {
    Captions,
  },

  props: {
    livestream: { type: Object }
  },

  data() {
    return {
      curr_time    : 0,
      image_data   : null,
      interval     : null,
      reload_every : 5 * 1000,
    }
  },

  computed: {
    playback_id() { 
      return this.livestream.playbackId 
    },
    time_format() {
      return time.time_format( this.curr_time * 1000  ) 
    }
    
  },  

  created() {
    this.$socket.client.emit('join_CC_room')
    this.reload_image()
    this.interval = setInterval(() => {
      this.reload_image()
    }, this.reload_every )
  },

  beforeUnmount() {
    this.$socket.client.emit('leave_CC_room')
    if ( this.interval ) {
      clearInterval( this.interval )
    }
  },

  methods: {

    reload_image() {
      this.curr_time = this.get_cur_time()
      api
      .get( this.source_url(), { responseType: 'blob' } )
      .then( res => this.image_data = this.image_src( res.data ) )
    },

    source_url() {
      return mux.thumb_src( this.playback_id, this.curr_time )
    },

    image_src( data ) {
      return window.URL.createObjectURL( data )
    },
    
    get_cur_time() {
      return mux.get_cur_time( this.livestream )
    },

  }

}

</script>

<template>
  <div
    id="low_res_player"
    aria-label="thumbnail player"
  > 

    <img
      ref="img"
      :title="`Thumbnail of livestream at ${ time_format }`"
      :alt="`Thumbnail of livestream at ${ time_format }`"
      :src="image_data"
    />
    <div role="status">
      <p>
        Thumbnail of livestream at <time>{{ time_format }}</time>
        (1 frame every {{ reload_every / 1000 }} seconds).
      </p>
    </div>
    <Captions 
      :native="false"
    />      
  </div>

</template>

<style scoped>


</style>
