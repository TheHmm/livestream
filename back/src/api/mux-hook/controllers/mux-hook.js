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

      data     = ctx.request.body.data,
      streamID = data.live_stream_id || data.id,
      status   = data.status


    // we are only interested in the 'idle' or 'active' events
    // so we stop here if it's another kind 
    
    if ( status !== 'idle' && status !== 'active' ) {
      strapi.log.warn(`[ REJECTING MUX HOOK: ${status} ]`)
      return 'Thanks, MUX!'
    } 


    // We log the hook to our consolw.

    strapi.log.info(`[ PROCESSING MUX HOOK: ${status} ]`)


    // We get the exisitng livestream from strapi.

    // await strapi
    // .service('api::livestream.livestream')
    // .find()
    // .then( async response => {


      // We set the livestream to the old, unsanitized, version
      // of itself that was stored on mux

      // const livestream = response?.privateData


      // We update the status of the livestream object with the
      // new status received from the mux hook.

      // livestream.status = status


      // If the livestream has arrived at an 'idle' state, the 
      // event payload will additionally carry an array of recent
      // asset IDs, so we add this to our updated object.

      // if (status == 'idle') {
        // livestream.recent_asset_ids = data.recent_asset_ids
      // }


      // We update the 'livestream' entry in Strapi with this 
      // new information.

      console.log(data)

      await strapi
      .service('api::livestream.livestream')
      .createOrUpdate({
        data: { data }
      })
      

    // })

    // We thank mux.

    return 'Thanks MUX!'

  },

    
  // We still have to inform connected sockets of this change,
  // so we continue in the appropriate place:
  // back/src/api/livestream/content-types/livestream/lifecycles.js   


}));
