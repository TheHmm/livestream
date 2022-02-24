'use strict';

/**
 *  event controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::event.event', ({ strapi }) =>  ({ 


  // We replace the default 'findOne' controller with
  // our own controller that defaults to the entry's
  // as it's ID (for easier front-end routing).
  
  async findOne(ctx) {

    const 

      // We get the slug which haas been passed in as the id.

      slug = ctx.params.id,


      // We query the database for that entry by its slug.

      entity = await strapi
      .db
      .query( 'api::event.event' )
      .findOne( { where: { slug } } )


    // We return the saitized and transformed entity.

    return this.transformResponse(
      await this.sanitizeOutput( 
        entity, 
        ctx
      )
    )

  },

}))
