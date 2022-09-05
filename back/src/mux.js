// MUX functions are here for better legibility

module.exports = MUX_TOKEN => {

  const


    // import mux-node

    MuxNode = require('@mux/mux-node'),


    // initialize mux Video object

    { Video } = new MuxNode(MUX_TOKEN.ID, MUX_TOKEN.SECRET),


    // our livestream options

    livestream_options  = {
      playback_policy     : 'public',
      reconnect_window    : 30,
      new_asset_settings  : {
        playback_policy   : 'public',
        mp4_support       : 'standard',
      },
      generated_subtitles : [{
        name          : "English CC (auto)",
        passthrough   : "English closed captions (auto-generated)",
        language_code : "en"
      }],
    },


    // MUX API proxy functions

    get_livestream = async id => {
      return await Video.LiveStreams.get( id )
    }

    get_asset = async id => {
      return await Video.Assets.get( id )
    }

    create_livestream = async () => {
      return await Video.LiveStreams.create( livestream_options )
    },

    update_livestream = async ( id, options ) => {
      return await Video.LiveStreams.update( id, options )
    },

    update_livestream_generated_subtitles = async ( id, options ) => {
      return await Video.LiveStreams.updateGeneratedSubtitles( id, options )
    },

    create_transcription_vocabularies = async ({ name, phrases }) => {
      return await Video.TranscriptionVocabularies.create({ name, phrases })
    },

    update_transcription_vocabularies = async ( id, { phrases } ) => {
      return await Video.TranscriptionVocabularies.update( id, { phrases } )
    },

    get_transcription_vocabularies = async ( id ) => {
      return await Video.TranscriptionVocabularies.get( id )
    },


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
      subtitles       : stream.generated_subtitles,
    }),


    // we reduce an asset obejct to its publically safe info

    get_public_asset_details = asset => ({
      status     : asset.status,
      playbackId : get_playback_id( asset ),
      start_time : new Date( asset.recording_times[0].started_at ).getTime(),
      tracks     : asset.tracks,
      duration   : asset.duration
    })


  // we return the mux object for use elsewhere

  return {
    livestream_options,
    get_livestream,
    get_asset,
    create_livestream,
    update_livestream,
    update_livestream_generated_subtitles,
    create_transcription_vocabularies,
    update_transcription_vocabularies,
    get_transcription_vocabularies,
    get_start_time,
    get_public_stream_details,
    get_public_asset_details,
  }

}
