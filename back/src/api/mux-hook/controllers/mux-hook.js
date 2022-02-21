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
      console.log(
        (new Date).toLocaleTimeString(), 
        `[ REJECTING MUX HOOK: ${status} ]`
      )
      return
    } 


    // We log the hook to our consolw.

    console.log(
      (new Date).toLocaleTimeString(), 
      `[ PROCESSING MUX HOOK: ${status} ]`
    )


    // We add the new mux-hook entry to our database.

    ctx.request.body.data = {
      event: data,
      streamID,
      status,
    }

    await super.create(ctx)


    // We thank mux.

    return 'Thanks MUX!'


    // There are still things to do with this event:
    // (1) updating the livestream
    // (2) informing the connected sockets

    // We continue here: 
    // back/src/api/mux-hook/content-types/mux-hook/lifecycles.js

  },

}));
