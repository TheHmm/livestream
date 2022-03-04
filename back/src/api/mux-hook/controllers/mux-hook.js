'use strict';

/**
 *  mux-hook controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::mux-hook.mux-hook', ({ strapi }) =>  ({


  // in this script we handle messages received from mux  
  // about the state of our livestream and assets.

  async create(ctx) {

    
    // From the mux event's body, we get the livestream's new
    // status ( 'idle' or 'active' ), its ID, and a payload.

    const
      event = ctx.request.body,
      type  = event.type,
      data  = event.data


    // Order of MUX events from the moment Marco starts streaming:
    // 1. video.live_stream.connected
    // 2. video.asset.created
    // 3. video.live_stream.recording  
    // 4. video.asset.ready                    => we process this
    // 5. video.live_stream.active             => we process this

    // Then, Marco click 'Stop Streaming', the ensuing events are:
    // 7. video.live_stream.disconnected       
    // 8. video.live_stream.idle               => we process this
    // 9. video.asset.live_stream_completed

    // The event video.asset.ready, contains the start time of our
    // livestream. Viewers would need this timestamp to sync up 
    // some of their UI activities with the livestream.

    if ( type == 'video.asset.ready' ) {
      strapi.log.info(`[ PROCESSING MUX HOOK: ${ type } ]`)
      const start_time = data?.recording_times[0]?.started_at?.seconds
      console.log(start_time)

      return 
    }


    // From here on we are only interested in the livvestream's 
    // 'idle' or 'active' events. We stop here if they are other.

    if ( 
      type !== 'video.live_stream.idle' && 
      type !== 'video.live_stream.active' 
    ) {
      strapi.log.warn(`[ REJECTING MUX HOOK: ${ type } ]`)
      return 
    }

    strapi.log.info(`[ PROCESSING MUX HOOK: ${ type } ]`)


    // Now, it's safe to assume that the received data is our 
    // livestream; we can update the 'livestream' entry in 
    // Strapi with this new information.
    
    await strapi
    .service('api::livestream.livestream')
    .createOrUpdate({
      data: { livestream: data }
    })
      

    // We thank mux.

    return 'Thanks MUX!'

  },

    
  // We still have to inform connected sockets of this change,
  // so we continue in the appropriate place:
  // back/src/api/livestream/content-types/livestream/lifecycles.js   


}));
