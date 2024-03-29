<script>

import { mapState }   from 'vuex'
import livestream from '@/utils/livestream'
import captions   from '@/utils/captions'
import api        from '@/api'

export default {

  name: 'Captions',

  props: {
    hls        : Object,
    playing    : Boolean,
    livestream : Object,
  },

  computed: {

    ...mapState('livestream', [
      'cc_interim',
      'cc',
    ] ),

    active() {
      return this.livestream?.status == 'active'
    },
    ready() {
      return this.livestream?.status == 'ready'
    },
    desired_time() {
      return this.$route.query.time
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
      if ( !this.hls && !this.ready ) {
        this.scroll_to_bottom()
      }
    },

    desired_time: {
      deep: true,
      immediate: true,
      handler( t ) {
        this.set_time( t )
      }
    }

  },

  created() {
    if ( this.ready ) {
      this.get_and_set_cc( this.livestream, this.$store.dispatch )
    }
    this.play()
  },

  mounted() {
    if ( !this.hls && !this.ready ) {
      this.scroll_to_bottom()
    }
    if ( this.desired_time ) {
      this.set_time( this.desired_time )
    }
  },

  beforeUnmount() {
    this.pause()
  },


  methods: {

    play() {
      if ( this.hls ) {
        this.hls.subtitleTrack = 0
      } else {
        if ( this.active ) {
          this.$socket.client.emit('join_CC_room')
        }
      }
    },

    pause() {
      if ( this.hls ) {
        this.hls.subtitleTrack = -1
      } else {
        if ( this.active ) {
          this.$socket.client.emit('leave_CC_room')
        }
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

    set_time( t ) {
      if ( t ) {
        console.log( `Setting time to ${ t } seconds.` )
        setTimeout(() => {
          if ( this.cc.length ) {
            const start_times = this.cc.map( cc => cc.startTime )
            if ( start_times ) {
              const nearest_start = start_times.reduce( (prev, curr) => {
                return ( Math.abs( curr - t ) < Math.abs( prev - t ) ? curr : prev);
              })
              if ( nearest_start ) {
                const nearest_element = document.getElementById( `t${ nearest_start }` )
                if ( nearest_element ) {
                  nearest_element.scrollIntoView({ behavior: 'smooth' })
                }
              }
            }
          }
          this.$router.push( { query: { ...this.$route.query, ...{ time: undefined } } } )
        }, 500 )
      }

    },


    // Manually pulling the subtitle file of an asset if it even
    // exists and converting it to text for the transcript mode

    get_and_set_cc( recording, dispatch ) {
      const text_track = recording.tracks.find( t => t.type == 'text' && t.text_source.includes('final') )
      if ( text_track ) {
        const cc_url = livestream.mux.text_src( recording.playbackId, text_track.id )
        api
        .get( cc_url )
        .then( ({ data }) => dispatch(
          'livestream/set_CC',
          captions.parse_vtt( data ),
          { root: true }
        ))
        .catch( err => console.error( err ) )
      }
    }

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
      :id="`t${ caption.startTime }`"
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
  margin: 0.5rem auto;
  width: 100%;
  font-size: 2rem;

}
#captions p span {
  --fore: var(--accent);
  --back: var(--white);
  display: inline;
  background-color: var(--back);
  padding: 0.125rem 0.5rem;
}

#playerpage #captions {
  width: 100%;
}
#playerpage #captions p span  {
  --fore: var(--black);
}
.mobile  #captions p {
  margin: 0.5rem auto;
  font-size: 1rem;
}
</style>
