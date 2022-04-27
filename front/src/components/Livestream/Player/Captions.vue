<script>

import { mapState }   from 'vuex'
import $log    from '@/utils/log'
import captions   from "@/utils/captions"
import livestream from '@/utils/livestream'



export default {

  name: 'Captions',

  props: {
    hls          : Object,
    playing      : Boolean,
  },

  computed: {

    ...mapState('livestream', [ 
      'cc_interim',
      'cc',
    ] ),

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
      if ( this.hls ) {
        this.hls.subtitleTrack = 0
      } else {
        this.$socket.client.emit('join_CC_room')
      }
    },

    pause() {
      if ( this.hls ) {
        this.hls.subtitleTrack = -1
      } else {
        this.$socket.client.emit('leave_CC_room')
      }
    },

    scroll_to_bottom() {
      setTimeout(() => {
        this.$el.scroll({
          top: this.$el.scrollHeight,
          behavior: 'smooth'
        })
      }, 50)
    },

  }


}

</script>

<template>

  <div 
    v-if="!hls && cc.length > 0"
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
  <div
    v-else-if="cc.length == 0"
    :id="$id()"
  >
    <p>Closed captions not available.</p>
  </div>

</template>

<style scoped>

#captions {
  padding: var(--size-s);
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
#captions p {
  margin-block-start: 0;
  max-width: 35rem;
  margin: var(--size-s) auto;
  width: 100%;
}
#captions p span {
  --fore: var(--accent);
  --back: var(--white);
  display: inline;
  background-color: var(--back);
  padding: 0.125rem 0.5rem;
}

</style>
