// MUX-specific fuctions are here for better legibility

module.exports = MUX_TOKEN => {

  const
  
    // import mux-node
    MuxNode = require('@mux/mux-node'),

    // initialize mux Video object
    { Video } = new MuxNode(MUX_TOKEN.ID, MUX_TOKEN.SECRET),

    // our livestream options
    livestreamOptions  = {
      playback_policy    : 'public',
      reconnect_window   : 10,
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
    createLiveStream = async () => {
      return await Video.LiveStreams.create(livestreamOptions)
    },
    
    // function to get livestream with MUX api 
    getLiveStream = async id => {
      return await Video.LiveStreams.get(id)
    }

    // lazy way of getting a stream's playback id
    getPlaybackId = stream => stream['playback_ids'][0].id,

    // we reduce a stream object to it's publically safe information
    getPublicStreamDetails = stream => ({
      status       : stream.status,
      playbackId   : getPlaybackId(stream),
      recentAssets : stream.recent_asset_ids,
    })

  // we return the mux object for use in the bootstrap.js file
  return {
    createLiveStream,
    getLiveStream,
    getPublicStreamDetails,
  }

}
