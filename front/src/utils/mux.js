import time from './time'

export default {

  get_cur_time( livestream ) {
    if ( livestream.start_time ) {
      return ( time.now() - livestream.start_time * 1000 ) / 1000
    } else {
      return 0.5
    }
  },

  source_url( playback_id, level, curr_time ) {
    if ( level == 'only_cc' ) {
      return this.thumb_src( playback_id, curr_time ) 
    } else if ( level == 'only_audio' ) {
      return this.audio_src( playback_id )
    } else {
      return this.video_src( playback_id )
    }
  }, 

  thumb_src( playback_id, curr_time ) {
    return `https://image.mux.com/${ playback_id }/thumbnail.jpg?&width=240&time=${ curr_time }`
  },

  video_src( playback_id ) {
    return `https://stream.mux.com/${ playback_id }.m3u8`
  },
  
  audio_src( playback_id ) {
    return `https://stream.mux.com/${ playback_id }.m3u8?add_audio_only=true`
  },

}
