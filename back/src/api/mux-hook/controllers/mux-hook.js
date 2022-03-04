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


    // We get the exisitng livestream from strapi.

    try {

      const livestream = await strapi
        .service( 'api::livestream.livestream' )
        .find()

      console.log(livestream)


    } catch ( error ) {
      return strapi.log.error( error )

    }

    // strapi
    // .service('api::livestream.livestream')
    // .find( )
    // .then( async response => {

    //   // We set the livestream to the old, unsanitized, version
    //   // of itself that was stored on mux

    //   livestream = response.privateData


    //   // We update the status of the livestream object with the
    //   // new status received from the mux hook.

    //   livestream.status = status


    //   // If the livestream has arrived at an 'idle' state, the 
    //   // event payload will additionally carry an array of recent
    //   // asset IDs, so we add this to our updated object.

    //   // if (status == 'idle') {
    //     livestream.recent_asset_ids = data.recent_asset_ids
    //   // }


    //   // We update the 'livestream' entry in Strapi with this 
    //   // new information.

    //   return 'Thanks MUX!'
    // })
    // .catch( error => {
    //   return strapi.log.error( error )
    // })


    // The event video.asset.ready, contains the start time of our
    // livestream. Viewers would need this timestamp to sync up 
    // some of their UI activities with the livestream.

    // if ( type == 'video.asset.ready' ) {
    //   start_time = strapi.mux.get_asset_start_time( data )
    //   console.log(start_time)
    // }


    


    // Now, it's safe to assume that the received data is our 
    // livestream; we can update the 'livestream' entry in 
    // Strapi with this new information.
    
    // await strapi
    // .service('api::livestream.livestream')
    // .createOrUpdate({
    //   data: { livestream: data }
    // })
      

    // We thank mux.

    return 'Thanks MUX!'

  },

    
  // We still have to inform connected sockets of this change,
  // so we continue in the appropriate place:
  // back/src/api/livestream/content-types/livestream/lifecycles.js   


}));
