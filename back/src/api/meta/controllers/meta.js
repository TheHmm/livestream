'use strict';

/**
 *  meta controller
 */


const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::meta.meta', ({ strapi }) => ({

  // https://github.com/hackersanddesigners/the-hmm-livestream/blob/master/public/server.js#L227

  async donate( ctx ) {

    const data = ctx.request.body

    try {
      const payment = await strapi.mollie.create_payment( data )
      console.log( 'donate-payment =>', payment )
      return { data: payment }

    } catch ( error ) {
      console.warn('donate-err =>', error)
      return { data: error }
    }


  },

  webhook( ctx ) {

    // const payment = await mollieClient.payments.get(ctx.request.body.orderId)
    // const data = await payment.json()
    // console.log(data)

    return 'Thanks Mollie!'

  }

}))
