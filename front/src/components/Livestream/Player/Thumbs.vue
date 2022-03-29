<script>
import { mux } from '@/utils/livestream'
import api from '@/api'
import Captions from './Captions.vue'
import Play from './Play.vue'


// The image / thumb player. This uses mux's handy API
// to get a thumbnail of the video at the current time
// of the livestream's active assset. See line 70 here:
// /back/src/api/mux-hook/controllers/mux-hook.js .

export default {

  name: 'Thumbs',

  components: {
    Captions,
    Play,
  },

  props: {
    livestream       : Object,
    desires_captions : Boolean
  },

  data() {
    return {
      curr_time    : 0,
      url          : null,
      image_data   : null,
      interval     : null,
      reload_every : 15 * 1000,
    }
  },

  computed: {
    playback_id() { 
      return this.livestream.playbackId 
    },
    time_format() {
      return this.$time.time_format( this.curr_time * 1000  ) 
    },
    playing() {
      return this.interval !== null
    }
    
  },  

  created() {
    this.play()
  },

  beforeUnmount() {
    this.pause()
  },

  methods: {

    play() {
      this.reload_image()
      this.interval = setInterval(() => {
        this.reload_image()
      }, this.reload_every )
    },

    pause() {
      if ( this.interval ) {
        clearInterval( this.interval )
        this.interval = null
      }
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
      return mux.get_cur_time( this.livestream )
    },

  }

}

</script>

<template>
  <div
    :id="$id()"
    aria-label="thumbnail player"
  > 
    <section
      v-if="image_data"
    >
      <div class="controls">
        <Play
          :playing="playing"
          @click="playing ? pause() : play() "
        />
      </div>
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
    <Captions 
      v-if="desires_captions"
      :playing="playing"
      :native="false"
    />      
  </div>

</template>

<style scoped>

#thumbs {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  text-align: justify;
}
#thumbs #captions {
  flex-basis: 66%;
  text-align: center;
  align-items: center ;
  border-top: var(--border);
}

img {
}
#thumbs section {
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

#thumbs .image_contaier {
  /* flex-basis: 50%; */
  display: flex;
  flex-direction: column;
  align-self: stretch;
  justify-content: center;
  align-items: center;
}

#thumbs .controls {
  flex-basis: 33%;
}

#thumbs section .desc {
  font-size: 0.9rem;
  text-align: center;
}
#thumbs section .desc p {
  margin-block-end: 0;
}

</style>
