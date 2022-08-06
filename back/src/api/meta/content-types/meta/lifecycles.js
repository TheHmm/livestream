const


  before_create_or_update = async ( event, strapi ) => {

    try {

      const {
        transcription_vocabulary,
        transcription_vocabulary_id
      } = await strapi.service('api::meta.meta').find({
        fields   : [ 'transcription_vocabulary_id' ],
        populate : [ 'transcription_vocabulary' ]
      })

      const name    = 'The Hmm Transcription Vocabulary'
      const phrases = [ ...new Set( transcription_vocabulary.map( p => p.phrase ) )]

      const result = await create_or_update_transcription_vocabulary(
        transcription_vocabulary_id,
        { name, phrases },
        strapi
      )
      console.log(result.id)
      event.params.data.transcription_vocabulary_id = result.id

      const livestream = await update_livestream_with_transcription_vocabulary_id(
        transcription_vocabulary_id,
        strapi
      )

    } catch ( error ) {
      console.log(error)
      throw error
    }


  },


  create_or_update_transcription_vocabulary = async ( id, { name, phrases }, strapi ) => {
    let result = []
    if ( phrases.length ) {
      if ( id ) {
        result = await strapi.mux.update_transcription_vocabularies( id, { name, phrases } )
      } else {
        result = await strapi.mux.create_transcription_vocabularies( { name, phrases } )
      }
      strapi.log.info(`[ * UPDATED TRANSCRIPTION VOCABULARIES * ]`)
    }
    return result
  },


  update_livestream_with_transcription_vocabulary_id = async ( transcription_vocabulary_id, strapi ) => {
    let { privateData: livestream } = await strapi.service('api::livestream.livestream').find()
    if (
      !livestream.
      generated_subtitles?.
      transcription_vocabulary_ids?.
      includes( transcription_vocabulary_id )
    ) {
      strapi.log.warn( 'Livestream will be updated with vocabulary ID.' )
      const generated_subtitles = strapi.mux.livestream_options.generated_subtitles
      generated_subtitles[0].transcription_vocabulary_ids = [ transcription_vocabulary_id ]
      livestream = await strapi.mux.update_livestream_generated_subtitles(
        livestream.id,
        { generated_subtitles }
      )
    }
    return livestream
  }


module.exports = {

  async beforeCreate( event ) { await before_create_or_update( event, strapi ) },
  async beforeUpdate( event ) { await before_create_or_update( event, strapi ) },

}
