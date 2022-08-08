const



  before_create_or_update = async event => {
    try {
      await process_vocabulary( event )
    } catch ( error ) {
      console.log(error)
      throw error
    }
  },



  process_vocabulary = async event => {


    // Since the create or upate event doesnt contain the
    // correct info on component fields and 'transcription_
    // vocabulary' is a component field, we have to query the
    // DB for the correct data.

    const {
      transcription_vocabulary,
      transcription_vocabulary_id
    } = await strapi.service('api::meta.meta').find({
      fields   : [ 'transcription_vocabulary_id' ],
      populate : [ 'transcription_vocabulary' ]
    })


    // Our transcription vocabulary name is a constant, and
    // the vocaulary itself is converted sanitize

    const
      name    = 'The Hmm Transcription Vocabulary',
      phrases = transcription_vocabulary.map( p => p.phrase )


    // It's possible that there aren't any phrases yet, so
    // we only move forward with requests to MUX if we have
    // phrases to update.

    if ( phrases.length ) {
      const res = await create_or_update_mux_vocabulary(
        transcription_vocabulary_id,
        { name, phrases }
      )


      // If a new transcription vocabulary has been created,
      // we receive an id back, and add it to as a field in
      // our meta object.

      event.params.data.transcription_vocabulary_id = res.id
      strapi.log.info(`[ * UPDATED TRANSCRIPTION VOCABULARY * ]`)


      // Last, we need to add the transcruption vocabulary
      // id to our livestream.

      await update_livestream_with_vocabulary_id( res.id )
    }

  },



  // If a transcription vocabulary id has been passed into
  // the function, then this vocabulary exists in MUX and
  // we need only update it. Else, we create new a vocabulary

  create_or_update_mux_vocabulary = async ( id, { name, phrases } ) => {
    let method, args
    if ( id ) {
      method = 'update'
      args   = [ id, { name, phrases } ]
    } else {
      method = 'create'
      args   = [ { name, phrases } ]
    }
    return await strapi.mux[ `${ method }_transcription_vocabularies` ]( ...args )
  },



  // We inform MUX that our livestream will be using this
  // transcription vocabulary, only if it doesnt know yet.
  // Note that we don't update the livestream entry in our
  // strapi, that's cus it's automatically done through mux
  // hooks (live_stream.updated event).

  update_livestream_with_vocabulary_id = async ( id ) => {
    const { privateData } = await strapi.service('api::livestream.livestream').find()
    if ( !livestream_has_vocabulary_id( privateData, id ) ) {
      strapi.log.warn( 'Livestream will be updated with vocabulary ID.' )
      const { generated_subtitles } = strapi.mux.livestream_options
      generated_subtitles[0].transcription_vocabulary_ids = [ id ]
      await strapi.mux.update_livestream_generated_subtitles(
        privateData.id,
        { generated_subtitles }
      )
    }
  },



  // Check if our livestream is currently configured with a
  // certain vocabulary id.

  livestream_has_vocabulary_id = ( stream, id ) => {
    return (
      id &&
      stream &&
      stream.generated_subtitles &&
      stream.generated_subtitles[0] &&
      stream.generated_subtitles[0].transcription_vocabulary_ids &&
      stream.generated_subtitles[0].transcription_vocabulary_ids.includes( id )
    )
  }


module.exports = {
  beforeCreate : before_create_or_update,
  beforeUpdate : before_create_or_update,
}
