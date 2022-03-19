'use strict';

/**
 *  meta controller
 */

// https://stackoverflow.com/questions/65715215/how-do-i-reach-request-body-in-strapi-middleware

const get_body = async req => {
  return new Promise(( resolve, reject ) => {
    let body = ''
    req.on('data', data => { body += data } )
    req.on('end', () => { resolve(JSON.parse( body ) ) } )
    req.on('error', () => { reject("Error") } )
  })
}

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::meta.meta', ({ strapi }) => ({

  async donate( ctx ) {

    console.log(ctx.request.body)
    const body = await get_body( ctx.req )
    console.log(body)

    // let data = req.body
    // console.log('data =>', data)
    // try {
    //   const payment = await mollieClient.payments.create({
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
