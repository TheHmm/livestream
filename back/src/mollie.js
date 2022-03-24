// MOLLIE functions are here for better legibility

module.exports = MOLLIE_CONFIG => {

  const 


    // Our mollie config, passed in from index.js
    
    apiKey      = MOLLIE_CONFIG.KEY,
    redirectUrl = MOLLIE_CONFIG.REDIRECT_URL,
    webhookUrl  = MOLLIE_CONFIG.WEBHOOK_URL,


    // We create the mollie client using our api key

    { createMollieClient } = require( '@mollie/api-client' ),
    mollie = createMollieClient( { apiKey } ),


    // Generate a random order id.

    order_id = () => {
      return Buffer.from(new Date(), 'utf8').toString('hex')
    },

    
    // Function to make payments with mollie.

    create_payment = async ({ amount, description, from }) => {
      return await mollie.payments.create({
        amount : {
          currency : 'EUR',
          value    : amount,
        },
        metadata : {
          order_id : order_id(),
        },
        redirectUrl: redirectUrl + `?from=${ from }`,
        description,
        webhookUrl,
      })
    }


  return {
    create_payment
  }

}
