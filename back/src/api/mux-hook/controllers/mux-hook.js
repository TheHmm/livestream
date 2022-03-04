'use strict';

/**
 *  mux-hook controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::mux-hook.mux-hook', ({ strapi }) =>  ({


  // in this script we handle messages received from mux  
  // about the state of our livestream.

  async create(ctx) {

    
    // From the mux event's body, we get the livestream's new
    // status ( 'idle' or 'active' ), its ID, and a payload.

    const

      type       = ctx.request.body.type,
      livestream = ctx.request.body.data,
      status     = livestream.status



    if ( type == 'video.live_stream.recording' ) {
      console.log(livestream)
    }

    // From here on we are only interested in 'idle' or 'active' 
    // events of the livestream. Mux also emits other events for
    // the stream as well as for other assets. We stop here if 
    // they are of that kind.

    if ( type !== 'video.live_stream.idle' && type !== 'video.live_stream.active' ) {
      strapi.log.warn(`[ REJECTING MUX HOOK: ${type} ]`)
      return 'Thanks, MUX!'
    }

    // we are only interested in the 'idle' or 'active' events
    // so we stop here if it's another kind 
    
    // if ( status !== 'idle' && status !== 'active' ) {
    //   strapi.log.warn(`[ REJECTING MUX HOOK: ${status} ]`)
    //   return 'Thanks, MUX!'
    // } 


    // We log the hook to our consolw.

    strapi.log.info(`[ PROCESSING MUX HOOK: ${status} ]`)

    // If the livestream has arrived at an 'idle' state, the 
    // event payload will additionally carry an array of recent
    // asset IDs, so we add this to our updated object.

    // if (status == 'idle') {
      // livestream.recent_asset_ids = data.recent_asset_ids
    // }


    // We update the 'livestream' entry in Strapi with this 
    // new information.

    await strapi
    .service('api::livestream.livestream')
    .createOrUpdate({
      data: { livestream }
    })
      

    // We thank mux.

    return 'Thanks MUX!'

  },

    
  // We still have to inform connected sockets of this change,
  // so we continue in the appropriate place:
  // back/src/api/livestream/content-types/livestream/lifecycles.js   


}));
