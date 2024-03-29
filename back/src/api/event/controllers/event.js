'use strict';

/**
 *  event controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::event.event', ({ strapi }) =>  ({


  // We replace the default 'findOne' controller with
  // our own controller that defaults to the entry's slug
  // as it's ID (for easier front-end routing).

  async findOne( ctx ) {


    // We get the slug and query from ctx.

    const
      { params }   = ctx,
      { id: slug } = params,
      { query }    = ctx.request


    // Cutom "count" controller to count our events. This is used in
    // the front-end to check whether the client has the right number
    // of events locally before GETting them all. For some reason, i
    // can't register this in Strapi as it's own controller. See:
    // https://forum.strapi.io/t/how-to-count-in-rest-api-in-v4/14765

    if ( slug == 'count' ) {

      return strapi
      .query( 'api::event.event' )
      .count( { where: query } )

    } else {


      // We query the database for the given entry by its slug.

      const
        entity = await strapi
        .db
        .query( 'api::event.event' )
        .findOne( {
          where    : { slug },
          select   : query.fields,
          populate : query.populate
        } )

      // We return the entity, transformed into a response.

      return this.transformResponse( entity )

    }

  },


}))
