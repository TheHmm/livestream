// MUX-specific fuctions are here for better legibility

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
      // latency_mode       : "low",
      new_asset_settings : { 
        playback_policy  : 'public' 
      },
      embedded_subtitles : [{
        name             : "English CC",
        passthrough      : "English closed captions",
        language_code    : "en-US",
        language_channel : "cc1"
      }],
    },


    // method for creating a livestream with MUX api

    create_livestream = async () => {
      return await Video.LiveStreams.create(livestream_options)
    },
    

    // function to get livestream with MUX api 

    get_livestream = async id => {
      return await Video.LiveStreams.get(id)
    }


    // lazy way of getting a stream's playback id

    get_playback_id = stream => stream['playback_ids'][0].id,


    // lazy way of getting an asset's start time

    get_start_time = asset => {
      const 
        seconds = asset?.recording_times[0]?.started_at?.seconds,
        nanos   = asset?.recording_times[0]?.started_at?.nanos,
        milli   = seconds * 1000 + nanos / 1000000
        console.log(milli)
      return milli
    },


    // we reduce a stream object to it's publically safe information

    get_public_stream_details = stream => ({
      status          : stream.status,
      playbackId      : get_playback_id(stream),
      active_asset_id : stream.active_asset_id,
      start_time      : stream.start_time,
      recentAssets    : stream.recent_asset_ids,
    })


  // we return the mux object for use in the bootstrap.js file
  
  return {
    create_livestream,
    get_livestream,
    get_start_time,
    get_public_stream_details,
  }

}
