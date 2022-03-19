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
    // try {
    //   const payment = await strapi.mollie.payments.create({
    //     amount: {
    //       currency: 'EUR',
    //       value: data.amount,
    //     },
    //     metadata: {
    //       order_id: Buffer.from(new Date(), 'utf8').toString('hex'),
    //     },
    //     description: data.description,
    //     redirectUrl: process.env.MOLLIE_REDIRECT_URL,
    //     webhookUrl: process.env.MOLLIE_WEBHOOK_URL
    //   })

    //   console.log('donate-payment =>', payment)
    //   res.send(payment)
    //   // console.log('getPaymentUrl =>', payment._links.checkout)
    //   // res.redirect(payment._links.checkout.url)
    // } catch (error) {
    //   console.warn('donate-err =>', error)
    //   res.send(error)
    // }

    return ctx

  },

  webhook( ctx ) {

    console.log( ctx )

    return 'Thanks Mollie!'

  }

}))
