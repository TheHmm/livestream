<script>

import { mapState }   from 'vuex'
import { logger }     from '@/utils'
import { livestream } from '@/utils'
import { captions }   from "@/utils"
import { time }       from "@/utils"



export default {

  name: 'Captions',

  props: {
    player: {
      type: Object
    },
    stream_start: {
      type: Number
    },
    native: {
      type: Boolean
    }
  },

  data() {
    return {
      track: 'WEBVTT - Generated using SRT2VTT \r\n\r\n'
    }
  },

  computed: {

    ...mapState('livestream', [ 
      'cc_interim',
      'cc',
    ] ),

    track_src() {
      return captions.vtt_to_blob( this.track )
    }
  },

  watch: {

    'cc':{
      deep: true,
      handler() {
        this.update_track()
      }
    }

  },

  created() {
  },

  async mounted() {
  },

  updated() {
  },

  beforeUnmount() {
  },


  methods: {

    update_track() {
      console.log(this.cc)
      const current_cc = this.cc[this.cc.length - 1]?.text
      if (this.native && this.player?.player && current_cc) {
        const
          now                     = time.now(),
          stream_start            = this.stream_start,
          current_livestream_time = ( now - stream_start ) / 1000,
          live_sync_position      = this.player.player.liveSyncPosition,
          _latency                = this.player.player.latencyController._latency 

        console.log(
          current_cc,
          current_livestream_time,
          live_sync_position,
          _latency,
          current_livestream_time - live_sync_position - _latency
        )
        // console.log(
        //   captions.caption_to_srt( 
        //     this.cc[this.cc.length-1], 
        //     stream_start, 
        //     ( current_livestream_time - live_sync_position - _latency ) * 1000
        //   ) )
        this.track += captions.srt_to_vtt(
            captions.caption_to_srt( 
              current_cc, 
              stream_start, 
            ( current_livestream_time - live_sync_position - _latency ) * 1000
          )
        ) 
        // console.log(this.track)

      }
    }
  }


}

</script>

<template>

  <track
    v-if="native && track_src"
    default 
    srclang="en" 
    kind="captions" 
    label="English" 
    :src="track_src"
  /> 

  <div 
    v-else
    :id="$id()"
  >
    <p
      v-for="( caption, id ) of cc"
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

</template>

<style scoped>


#captions {
  max-height: 300px;
  overflow: scroll;
}

</style>
