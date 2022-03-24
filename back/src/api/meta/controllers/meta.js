'use strict';

/**
 *  meta controller
 */


const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::meta.meta', ({ strapi }) => ({

  // https://github.com/hackersanddesigners/the-hmm-livestream/blob/master/public/server.js#L227

  async donate( ctx ) {

    const data = ctx.request.body
    console.log(data)
    try {
      const payment = await strapi
        .mollie
        .create_payment( data )

      console.log('donate-payment =>', payment)
      // res.send(payment)
      // // console.log('getPaymentUrl =>', payment._links.checkout)
      // // res.redirect(payment._links.checkout.url)

      // console.log(this.transformResponse( payment ))
      console.log(ctx)
      return { data: payment }

    } catch (error) {
      // console.warn('donate-err =>', error)
      // res.send(error)
    }


  },

  webhook( ctx ) {

    console.log( ctx )

    return 'Thanks Mollie!'

  }

}))
