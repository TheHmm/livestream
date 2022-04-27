// MUX functions are here for better legibility

module.exports = MUX_TOKEN => {

  const
  

    // import mux-node

    MuxNode = require('@mux/mux-node'),


    // initialize mux Video object

    { Video } = new MuxNode(MUX_TOKEN.ID, MUX_TOKEN.SECRET),


    // our livestream options

    livestream_options  = {
      playback_policy    : 'public',
      reconnect_window   : 10,
      new_asset_settings : { 
        playback_policy  : 'public' 
      },
      // latency_mode       : 'low',
      generated_subtitles: [
        {
          name: "English CC (auto)",
          passthrough: "English closed captions (auto-generated)",
          language_code: "en"
        }
      ],
    },


    // method for creating a livestream with MUX api

    create_livestream = async () => {
      return await Video
        .LiveStreams
        .create( livestream_options )
    },
    

    // function to get livestream with MUX api 

    get_livestream = async id => {
      return await Video.LiveStreams.get( id )
    }


    // lazy way of getting a stream's playback id

    get_playback_id = stream => stream['playback_ids'][0].id,


    // lazy way of getting an asset's start time

    get_start_time = asset => {
      const 
        start   = asset?.recording_times[0]?.started_at,
        seconds = start?.seconds,
        nanos   = start?.nanos,
        milli   = seconds * 1000 + nanos / 1000000
        console.log(milli)
      return milli
    },


    // we reduce a stream object to its publically 
    // safe information

    get_public_stream_details = stream => ({
      status          : stream.status,
      playbackId      : get_playback_id(stream),
      active_asset_id : stream.active_asset_id,
      start_time      : stream.start_time,
    })


  // we return the mux object for use elsewhere
  
  return {
    create_livestream,
    get_livestream,
    get_start_time,
    get_public_stream_details,
  }

}
