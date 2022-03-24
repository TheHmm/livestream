// MOLLIE functions are here for better legibility

module.exports = MOLLIE_CONFIG => {

  const 


    // Our mollie config, passed in from index.js
    
    apiKey      = MOLLIE_CONFIG.KEY,
    redirectUrl = MOLLIE_CONFIG.REDIRECT_URL,
    webhookUrl  = MOLLIE_CONFIG.WEBHOOK_URL,
    currency    = 'EUR',


    // We create the mollie client using our api key

    { createMollieClient } = require( '@mollie/api-client' ),
    mollie = createMollieClient( { apiKey } ),


    // Generate a random order id.

    order_id = () => {
      return Buffer.from(new Date(), 'utf8').toString('hex')
    },


    // Function to make payments with mollie.

    create_payment = async ({ amount: value, description, from }) => {
      return await mollie.payments.create({
        amount : {
          value,
          currency,
        },
        description,
        metadata : {
          order_id : order_id(),
        },
        redirectUrl: redirectUrl + `?from=${ from }`,
        webhookUrl,
      })
    }


  return {
    create_payment
  }

}
