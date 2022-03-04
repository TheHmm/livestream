<script>
import Hls        from 'hls.js'
import { logger } from '@/utils'
import { time }   from '@/utils'
import networking from '@/networking'

export default {

  name: 'Player',

  props: {

    livestream: {
      type: Object
    },

    level: {
      type: String
    },

  },
  data() {
    return {
      hls: null,
      img_interval : null,
      reload_every : 15 * 1000,
      default_time : 0.5,
    }
  },
  computed: {
    playback_id() { 
      return this.livestream.playbackId 
    },
    active() { 
      return this.livestream.status == 'active' 
    },
  },
  watch: {
    livestream() {
      if ( this.active ) {
        this.update_stream()
      } else {
        if (this.hls) {
          this.hls.destroy()
        }
        this.$el.src = undefined
      }
    },
    level() {
      // logger.log('LIVESTREAM', this.level)
      this.level_changed = true
    }
  },

  created() {
  },

  mounted() {
    this.update_stream()
  },

  updated() {
    if (this.level_changed) {
      this.update_stream()
      this.level_changed = false
    }
  },

  methods: {

    update_stream() {

      logger.info( 'LIVESTREAM', `Updating stream: ${ this.level }` )

      if ( this.hls ) {
        this.hls.destroy()
      }
      if ( this.img_interval ) {
        clearInterval( this.img_interval )
      }

      if ( this.level == 'only_cc' ) {

        this.$socket.client.emit('join_CC_room')

        this.reload_img()
        this.img_interval = setInterval(() => {
          this.reload_img()
        }, this.reload_every )

      } else {

        this.$socket.client.emit('leave_CC_room')

        const
          player      = this.$el,
          playback_id = this.playback_id,
          source_url  = this.source_url( playback_id )

        // If HLS.js is supported on this platform

        if (  Hls.isSupported() ) {

          this.hls = new Hls()
          this.init_stream_monitor( this.hls, Hls.Events )
          this.hls.loadSource( source_url )
          this.hls.attachMedia( player )
          console.log(source_url)


          this.hls.on(Hls.Events.MANIFEST_PARSED, event => {
            player.play()
          })

        // If the player can support HLS natively

        } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
          player.src = source_url
          player.addEventListener('loadedmetadata', () => {
            player.play()
          })

        } else {
          logger.error('LIVESTREAM', `Can't play livestream!`)
        }

      }

     

    },

    reload_img( ) {
      const
        player      = this.$refs.img,
        playback_id = this.playback_id,
        curr_time   = this.get_current_time( this.livestream ),
        source_url  = this.source_url( playback_id, curr_time )
      console.log(source_url)
      player.src = source_url
    },

    get_current_time( livestream ) {
      if ( livestream.start_time ) {
        return ( time.now() - livestream.start_time * 1000 ) / 1000
      } else {
        return this.default_time
      }
    },

    source_url( playback_id, curr_time ) {
      if ( this.level == 'only_cc' ) {
        return this.thumb_src( playback_id, curr_time ) 
      } else if ( this.level == 'only_audio' ) {
        return this.audio_src( playback_id )
      } else {
        return this.video_src( playback_id )
      }
    },

    video_src( playback_id ) {
      return `https://stream.mux.com/${ playback_id }.m3u8`
    },
    audio_src( playback_id ) {
      return `https://stream.mux.com/${ playback_id }.m3u8?add_audio_only=true`
    },
    thumb_src( playback_id, curr_time ) {
      return `https://image.mux.com/${ playback_id }/thumbnail.jpg?&width=240&time=${ curr_time }`
    },

    init_stream_monitor( hls, events ) {
      networking.watchers.stream_monitor.init( hls, events )
    },

  }
}
</script>

<template>
  <div
    v-if="level == 'only_cc'"
  > 
    <img
      ref="img"
    />
    <caption>Closed Captions</caption>
  </div>
  <audio
    v-else-if="level == 'only_audio'"
    muted
    controls
    autoplay
  >
  </audio>
  <video
    v-else
    muted
    controls
    autoplay
  >
  </video>
</template>

<style>
video {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
.mobile video {
  object-fit:unset;
  height: unset;
}
</style>
