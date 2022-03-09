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


    // Order of MUX events from the moment Marco starts streaming:
    // 1. video.live_stream.connected
    // 2. video.asset.created
    // 3. video.live_stream.recording  
    // 4. video.asset.ready                   => we process this
    // 5. video.live_stream.active            => we process this

    // Then, Marco click 'Stop Streaming', the ensuing events are:
    // 7. video.live_stream.disconnected       
    // 8. video.live_stream.idle              => we process this
    // 9. video.asset.live_stream_completed

    // From here on we are only interested in events 4, 5, and 8.
    // We stop here if the event is of any other type are other.

    if ( 
      type !== 'video.asset.ready' &&
      type !== 'video.live_stream.active' &&
      type !== 'video.live_stream.idle'
    ) {
      strapi.log.warn(`[ REJECTING MUX HOOK: ${ type } ]`)
      return 'Thanks MUX!'
    }

    strapi.log.info(`[ PROCESSING MUX HOOK: ${ type } ]`)


    // We get the current livestream from Strapi, which is the
    // pirvateData property of the livestream entry in Strapi.

    try {

      const livestream = (
        await strapi
        .service( 'api::livestream.livestream' )
        .find()
      ).privateData


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
        
        livestream.status     = 'active'
        livestream.start_time = strapi.mux.get_start_time( data )


      // We proccess the livestream.active and livestream.idle
      // events, which provide updated metdata about our stream.
      // Note that we are being selective: all the other props
      // of the data object are still the same as livestream.
      
      } else if (
        type == 'video.live_stream.active' ||
        type == 'video.live_stream.idle'
      ) {
        livestream.status           = data.status
        livestream.active_asset_id  = data.active_asset_id
        livestream.recent_asset_ids = data.recent_asset_ids
      }


      // Finally, we update the 'livestream' entry in Strapi 
      // with this new information.
      
      await strapi
      .service( 'api::livestream.livestream' )
      .createOrUpdate({
        data: { livestream }
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
