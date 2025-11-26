
const { difference } = require('../utils')

const before_create = async context => {
  // link to livestream if not yet set
  if ( !context.params.data.livestream ) {
    const found = await strapi.documents( 'api::livestream.livestream' ).findFirst()
    if ( found ) {
      context.params.data.livestream = found.documentId
    }
  }
}

const before_update = async context => {
  const params    = context.params

  // fetch recording if asset_id provided

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


  // We get our new entry from event payload and our old
  // one from Strapi.
  
  // const
  //   new_event = params.data,
  //   slug      = params.data.slug,
  //   api       = strapi.documents( 'api::event.event' ),
  //   old_event = await api.findOne( params )


  // We get the updates to the entry using difference
  // function: @/back/src/utils.js

  // const diff = difference( old_event, new_event )

  // We delete confused differences from our diff object.
  // Strapi is excluding the id when we use the findOne()
  // function as well as returning dates as a string (and
  // not an object)

  // delete diff.documentId
  // delete diff.createdAt
  // delete diff.publishedAt
  // delete diff.createdBy
  // delete diff.updatedBy

  // if ( diff.emoji_groups ) {
  //   delete diff.emoji_groups
  // }

  // diff.slug = slug


  // We inform connected sockets.
  // TODO: not working

  // strapi.io.emit( 'event_update', diff )
  

}

module.exports = {


  // In this function we handle updates to the 'event'.
  // We inform all connected socket clients of new info.
  // the frontend of this project hanndles the rest.

  event_hooks() {
    return async ( context, next ) => {

      // before update 
      const { uid, action } = context
      if (uid == 'api::event.event' && action == 'update' ) {
        await before_update( context )
      } else if (uid == 'api::event.event' && action == 'create' ) {
        await before_create( context )
      }
      
      return next()
    }
  }
}
