'use strict';

/**
 *  mux-hook controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::mux-hook.mux-hook', ({ strapi }) =>  ({


  // in this script we handle messages received from mux
  // about the state of our livestream and assets.

  async create(ctx) {


    // From the mux hook's body, we get the type of event,
    // as well as the payload.

    const
      event = ctx.request.body,
      type  = event.type,
      data  = event.data


    // Order of MUX events from when Marco starts streaming:
    // 1. video.live_stream.connected
    // 2. video.asset.created
    // 3. video.live_stream.recording
    // 4. video.asset.ready              => we process this
    // 5. video.live_stream.active       => we process this

    // Then Marco clicks 'Stop Streaming' & the events are:
    // 7. video.live_stream.disconnected
    // 8. video.live_stream.idle         => we process this

    // From here on we are only interested in events 4, 5,
    // and 8. We stop here if the event is of any other type.
    // A last event type we want is "updated" to account for
    // livestream updates that happen such as a change in
    // transcription vocabulary ids.

    if (
      type !== 'video.asset.ready' &&
      type !== 'video.live_stream.active' &&
      type !== 'video.live_stream.idle' &&
      type !== 'video.live_stream.updated'
    ) {
      strapi.log.warn(`[ REJECTING MUX HOOK: ${ type } ]`)
      return 'Thanks MUX!'
    }

    strapi.log.info(`[ PROCESSING MUX HOOK: ${ type } ]`)


    // We get the current livestream from Strapi, which is the
    // pirvateData property of the livestream entry in Strapi.

    try {

      const livestream = await strapi.documents( 'api::livestream.livestream' ).find({
        where: {
          // privateData.playbackId == data.playbackId
        }
      })

      const { documentId, privateData } = livestream

      // We proess the event video.asset.ready, which contains
      // the start time of our livestream. Viewers would need
      // this timestamp to sync up some of their UI activities.

      if ( type == 'video.asset.ready' ) {


        // We make sure that the video asset refers to the one
        // that is currently being livestreamed. Mux emit's this
        // event for other kinds of video assets as well.

        if ( !data.is_live ) {
          strapi.log.warn(`[ REJECTING MUX HOOK: ${ type } / wrong asset. ]`)
          return 'Thanks MUX!'
        }

        privateData.status     = 'active'
        privateData.start_time = strapi.mux.get_start_time( data )


      // We proccess the livestream.active and livestream.idle
      // events, which provide updated metdata about our stream.
      // Note that we are being selective: all the other props
      // of the data object are still the same as livestream.

      } else if (
        type == 'video.live_stream.active' ||
        type == 'video.live_stream.idle'   ||
        type == 'video.live_stream.updated'
      ) {
        privateData.status              = data.status
        privateData.active_asset_id     = data.active_asset_id
        privateData.recent_asset_ids    = data.recent_asset_ids
        privateData.generated_subtitles = data.generated_subtitles
      }


      // Finally, we update the 'livestream' entry in Strapi
      // with this new information.

      await strapi.documents( 'api::livestream.livestream' ).update({
        documentId,
        data: { privateData }
      })

    } catch ( error ) {
      return strapi.log.error( error )

    }

    // We thank mux.

    return 'Thanks MUX!'

  },


  // We still have to inform connected sockets of this change,
  // so we continue in the appropriate place:
  // back/src/api/livestream/content-types/livestream/lifecycles


}))
