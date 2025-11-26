
const { difference } = require('../utils')

// link to livestream if not yet set
const before_create = async context => {
  if ( !context.params.data.livestream ) {
    const found = await strapi.documents( 'api::livestream.livestream' ).findFirst()
    if ( found ) {
      context.params.data.livestream = found.documentId
    }
  }
}

// fetch recording if asset_id provided
const before_update = async context => {
  const params    = context.params
  const recording = params.data.mux_recording
  if ( recording ) {
    const asset_id = recording.asset_id
    const status = recording.status
    if ( asset_id  && !status ) {
      try {
        const asset = await strapi.mux.get_asset( asset_id )
        params.data.mux_recording = strapi.mux.get_public_asset_details( asset )
        strapi.log.info(`[ * Playback ID: ${ params.data.mux_recording.playbackId }`)
      } catch ( err ) {
        console.error(err)
        params.data.mux_recording = {
          error: err,
          asset_id: null,
        }
      }
    }
  }
}

// inform connected sockets after update
const after_update = async result => {
  const documentId = result.documentId
  const event = await strapi.documents('api::event.event').findOne({
    documentId,
    fields: '*', 
    populate: [ 
      'viewers',
      'font',
      'font.file',
      'background_image',
      'emoji_groups',
      'emoji_groups.emoji',
      'emoji_groups.emoji.image',
      'organisation',
      'organisation.Logo',
    ]
  })
  strapi.io.to(event.slug).emit( 'event_update', event )
}

module.exports = {


  // In this function we handle updates to the 'event'.
  // We inform all connected socket clients of new info.
  // the frontend of this project hanndles the rest.

  event_hooks() {
    return async ( context, next ) => {
      const { uid, action } = context
      if (uid == 'api::event.event' && action == 'update' ) {
        await before_update( context )
      } else if (uid == 'api::event.event' && action == 'create' ) {
        await before_create( context )
      }
       let result = await next()
       if (uid == 'api::event.event' && action == 'update' ) {
        await after_update( result )
       }
      return result
    }
  }
}
