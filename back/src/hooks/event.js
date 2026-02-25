
const { difference } = require('../utils')

const before_create = async context => {

  let organisation, livestream
 
  // link to organisation if not set
  if ( !context.params.data.organisation ) {
    organisation = await strapi.documents( 'api::organisation.organisation' ).findFirst({
      filters: { createdBy: context.params.data.createdBy },
      populate: [ 'livestream' ]
    })
    if ( organisation ) {
      context.params.data.organisation = organisation.documentId
    }
  } else {
    organisation = await strapi.documents( 'api::organisation.organisation' ).findOne({
      documentId: context.params.data.organisation.connect[0]?.documentId,
      populate: [ 'livestream' ]
    })
  }

  // link to livestream if not set, try to match by organisation first, then go to default
  if ( !context.params.data.livestream ) {
    livestream = organisation?.livestream
    if ( !livestream ) {
      livestream = await strapi.documents( 'api::livestream.livestream' ).findFirst({ 
        filters: { slug: 'default' } 
      })
    }
    if ( livestream ) {
      context.params.data.livestream = livestream.documentId
    }
  }
}

// fetch recording if asset_id provided
const before_update = async context => {
  let recording = context.params.data.mux_recording
  if ( recording ) {
    if (typeof recording === 'string' ) {
      recording = JSON.parse( recording )
    }
    console.log( recording, recording.asset_id, recording.status )
    const asset_id = recording.asset_id
    const status = recording.status
    if ( asset_id  && !status ) {
      strapi.log.info(`[ * Manually fetching recording with asset ID: ${ asset_id }`)
      try {
        const asset = await strapi.mux.get_asset( asset_id )
        context.params.data.mux_recording = strapi.mux.get_public_asset_details( asset )
        strapi.log.info(`[ * Playback ID: ${ context.params.data.mux_recording.playbackId }`)
      } catch ( err ) {
        console.error(err)
        context.params.data.mux_recording = {
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
