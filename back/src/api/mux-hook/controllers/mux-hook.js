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


    // We log the hook to our consolw.

    console.log(
      (new Date).toLocaleTimeString(), 
      `[ MUX HOOK: livestream is ${status} ]`
    )


    // We add the new mux-hook entry to our database.

    // await strapi
    // .service('api::mux-hook.mux-hook')
    // .create({
    //   event: data,
    //   streamID,
    //   status,
    // })

    // return {
    //   event: data,
    //   streamID,
    //   status,
    // }

    await super
    .create({
        event: data,
        streamID,
        status,
      })

    // // We thank mux.

    return 'Thanks MUX!'


    // There are still things to do with this event:
    // (1) updating the livestream
    // (2) informing the connected sockets

    // We continue here: 
    // back/src/api/mux-hook/content-types/mux-hook/lifecycles.js

  },

}));
