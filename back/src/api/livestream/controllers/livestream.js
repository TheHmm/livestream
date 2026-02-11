'use strict';

/**
 *  livestream controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::livestream.livestream', ({ strapi }) => ({

  // Custom way of authentiating rights to the livestream
  async authenticate( ctx ) {

    // We get the slug and query from ctx.
    const
      { slug } = ctx.request.params,
      { key } = ctx.request.body

    // We query the database for the given entry by its slug.
    const entity = await strapi.documents( 'api::livestream.livestream' ).findFirst({
      filters : { slug },
      fields : [ 'stream_key', 'slug' ]
    })
    if ( !entity ) {
      return ctx.notFound(`Stream ${ slug} not found.`)
    } else if ( key !== entity.stream_key ) {
      return ctx.forbidden(`Invalid key for stream ${ slug }.`)
    }

    // We return the entity, transformed and sanitzed.
    const sanitized = await this.sanitizeOutput( entity, ctx)
    return this.transformResponse( sanitized )

  }

}))
