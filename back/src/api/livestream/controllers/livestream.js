'use strict';

/**
 *  livestream controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::livestream.livestream', ({ strapi }) =>  ({
  async find( ctx ) {

      const { data, meta } = await super.find(ctx)

      console.log(data)

      return { data, meta }
    }

}))
