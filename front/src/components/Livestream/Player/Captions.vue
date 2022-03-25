<script>

import { mapState }   from 'vuex'
import { logger }     from '@/utils'
import { livestream } from '@/utils'
import { captions }   from "@/utils"
import { time }       from "@/utils"



export default {

  name: 'Captions',

  props: {
    playing: {
      type: Boolean,
    },
    hls: {
      type: Object
    },
    stream_start: {
      type: Number
    },
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

    playing() {
      if ( this.playing ) {
        this.play() 
      } else {
        this.pause()
      }
    },

    cc_interim() {
      if ( !this.hls ) {
        this.scroll_to_bottom()
      }
    },

    'cc':{
      deep: true,
      handler() {
        if ( this.hls ) {
          this.update_track()
        }
      }
    },


  },

  created() {
    this.play()
  },

  mounted() {
    if ( !this.hls ) {
      this.scroll_to_bottom()
    }
  },

  updated() {
  },

  beforeUnmount() {
    this.pause()
  },


  methods: {

    play() {
     this.$socket.client.emit('join_CC_room')
    },

    pause() {
     this.$socket.client.emit('leave_CC_room')
    },

    scroll_to_bottom() {
      setTimeout(() => {
        this.$el.scroll({
          top: this.$el.scrollHeight,
          behavior: 'smooth'
        })
      }, 50)
    },

    update_track() {
      const current_cc = this.cc[this.cc.length - 1]
      if ( this.hls && current_cc?.text ) {
        console.log(this.cc)
        const
          now                     = time.now(),
          stream_start            = this.stream_start,
          current_livestream_time = ( now - stream_start ) / 1000,
          live_sync_position      = this.hls.liveSyncPosition,
          _latency                = this.hls.latencyController._latency 

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
    v-if="hls && track_src"
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
    <span>{{ caption.text }}</span>
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
  padding: 0 1rem;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
#captions p {
  margin-block-start: 0;
}
#captions p span {
  --fore: var(--accent);
  --back: var(--white);
  display: inline;
  background-color: var(--back);
  padding: 0.125rem 0.5rem;
}

</style>
