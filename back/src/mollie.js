// MOLLIE functions are here for better legibility

module.exports = MOLLIE_KEY => {

  const { 
    createMollieClient 
  } = require( '@mollie/api-client' )

  return createMollieClient( { apiKey: MOLLIE_KEY  }) 

}
