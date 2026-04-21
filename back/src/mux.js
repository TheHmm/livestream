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
    },

    subtitle_langs = {
      en: {
        name          : "English (auto)",
        passthrough   : "English closed captions (auto-generated)",
        language_code : "en"
      },
      fr: {
        name          : "Français (auto)",
        passthrough   : "Sous-titres en français (générés automatiquement)",
        language_code : "fr"
      },
      es: {
        name          : "Español (auto)",
        passthrough   : "Subtítulos en español (generados automáticamente)",
        language_code : "es"
      },
      it: {
        name          : "Italiano (auto)",
        passthrough   : "Sottotitoli in italiano (generati automaticamente)",
        language_code : "it"
      },
      pt: {
        name          : "Português (auto)",
        passthrough   : "Legendas em português (geradas automaticamente)",
        language_code : "pt"
      },
      de: {
        name          : "Deutsche (auto)",
        passthrough   : "Deutsche untertitel (automatisch generiert)",
        language_code : "de"
      },
      
    },


    // MUX API proxy functions

    get_livestream = async id => {
      return await Video.LiveStreams.get( id )
    }

    get_asset = async id => {
      return await Video.Assets.get( id )
    }

    create_livestream = async subtitle_lang => {
      return await Video.LiveStreams.create( { 
        ...livestream_options, 
        ... { generated_subtitles: [ subtitle_langs[subtitle_lang] ] }
      })
    },

    update_livestream = async ( id, options ) => {
      return await Video.LiveStreams.update( id, options )
    },

    update_livestream_generated_subtitles = async ( id, subtitle_lang ) => {
      console.log( id, { generated_subtitles: subtitle_langs[subtitle_lang] })
      return await Video.LiveStreams.updateGeneratedSubtitles( id, { generated_subtitles: [ subtitle_langs[subtitle_lang] ] } )
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
      start_time : new Date( asset.recording_times ? asset.recording_times[0].started_at : asset.created_at ).getTime(),
      tracks     : asset.tracks,
      duration   : asset.duration
    })


  // we return the mux object for use elsewhere

  return {
    livestream_options,
    subtitle_langs,
    get_livestream,
    get_asset,
    create_livestream,
    update_livestream,
    update_livestream_generated_subtitles,
    get_start_time,
    get_public_stream_details,
    get_public_asset_details,
  }

}
