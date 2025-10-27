<script>
import { mux } from '@/utils/livestream'
import api from '@/api'
import Captions from './Captions.vue'
import HlsMedia from './HlsMedia.vue'


// Hybrid Audio / Caption / Thumb player

export default {

  name: 'Thumbs',

  components: {
    Captions,
    HlsMedia
  },

  props: {
    livestream : Object,
    mode : Object,
    muted : Boolean,
    event: Object,
  },

  data() {
    return {
      curr_time    : 0,
      url          : null,
      image_data   : null,
      interval     : null,
      reload_every : 5 * 1000,
      playing      : false,
      remaining    : 0,
      start_time   : new Date(),
      recording_playback_thumb_time: 0,
    }
  },

  computed: {
    playback_id() {
      return this.livestream.playbackId
    },
    time_format() {
      return this.$time.dur_format( this.curr_time * 1000 )
    },
    desired_time() {
      return this.$route.query.time
    }

  },

  created() {
    if ( this.desired_time ) {
      this.set_time( this.desired_time )
    }
    this.play()
  },

  beforeUnmount() {
    this.pause()
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

    play() {
      if ( this.playing ) {
        return
      }
      setTimeout(() => {
        this.reload_image()
        this.start_time = new Date()
        this.interval = setInterval(() => {
          this.reload_image()
        }, this.reload_every )
      }, this.remaining )
      this.playing = true
    },

    pause() {
      if ( !this.playing ) {
        return
      }
      if ( this.interval ) {
        this.remaining = this.reload_every - (new Date() - this.start_time)
        clearInterval( this.interval )
        this.interval = null
      }
      this.playing = false
    },

    reload_image() {
      this.curr_time = this.get_cur_time()
      this.url = this.source_url()
      api
      .get( this.url, { responseType: 'blob' } )
      .then( res => this.image_data = this.image_src( res.data ) )
    },

    source_url() {
      return mux.thumb_src( this.playback_id, this.curr_time )
    },

    image_src( data ) {
      return window.URL.createObjectURL( data )
    },

    get_cur_time() {
      let curr_time
      if ( this.event.is_in_past ) {
        curr_time = this.recording_playback_thumb_time
        this.recording_playback_thumb_time += this.reload_every / 1000
      } else {
        curr_time =  mux.get_cur_time( this.livestream, this.event )
      }
      return curr_time
    },

    set_time( t ) {
      if ( t ) {
        console.log( `Setting time to ${ t } seconds.` )
        this.recording_playback_thumb_time = +t
        this.$router.push( { query: { ...this.$route.query, ...{ time: undefined } } } )
        this.pause()
        this.play()
      }
    },

    IntervalTimer(callback, interval) {
      let timerId, startTime, remaining = 0
      let state = 0 //  0 = idle, 1 = running, 2 = paused, 3= resumed
      this.resume = function () {
          if (state != 2) return

          state = 3
          window.setTimeout(this.timeoutCallback, remaining)
      }
      this.timeoutCallback = function () {
          if (state != 3) return

          callback()

 
          state = 1
      }
      startTime = new Date()
      timerId = window.setInterval(callback, interval)
      state = 1
    }

  }

}

</script>

<template>
  <div
    id="audio_th"
    aria-label="thumbnail player"
  >
    <section
      v-if="image_data"
    >
      <div class="image_contaier">
        <img
          ref="img"
          :title="`Thumbnail of livestream at ${ time_format }`"
          :alt="`Thumbnail of livestream at ${ time_format }`"
          :src="image_data"
        />
        <div class="desc">
          <p>
            ↪ <a
                target="blank"
                :title="`Thumbnail of livestream at ${ time_format }`"
                :href="url"
              >Thumbnail of livestream at <time>{{ time_format }}</time></a>
            <br>(1 frame every {{ reload_every / 1000 }} seconds).
          </p>
        </div>
      </div>
      <div class="controls">
      </div>
    </section>
    <section
      v-else
    >
      <span>Loading...</span>
    </section>
    <HlsMedia
      :livestream="livestream"
      :event="event"
      :mode="mode"
      :muted="muted"
      @play="play"
      @pause="pause"
      @seeked="set_time"
    />
    <Captions
      :playing="playing"
      :livestream="livestream"
    />
  </div>

</template>

<style scoped>

#audio_th {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  text-align: justify;
}
#audio_th #captions {
  flex-basis: 66%;
  text-align: center;
  align-items: center ;
  border-top: var(--border);
}

img {
}
#audio_th section {
  /* height: 100%; */
  flex-grow: 1;
  /* flex-basis: 50%; */
  float: right;
  display: flex;
  padding: var(--size-s);
  align-self: stretch;
  justify-content: center;
  align-items: center;
}

#audio_th .image_contaier {
  /* flex-basis: 50%; */
  display: flex;
  flex-direction: column;
  align-self: stretch;
  justify-content: center;
  align-items: center;
}

#audio_th .controls {
  /* flex-basis: 33%; */
  padding-top: 1rem;
}

#audio_th section {
  padding: 1%;
  min-height: unset;
}

#audio_th section .desc {
  font-size: 0.8rem;
  line-height: 1.3;
  text-align: center;
}
#audio_th section .desc p {
  margin-block-end: 0;
}

.mobile #audio_th img {
  max-width: 10rem;
}
</style>
