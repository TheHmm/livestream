// MUX-specific fuctions are here for better legibility

module.exports = MOLLIE_API_KEY => {

  const { createMollieClient } = require('@mollie/api-client')
  const mollie_client = createMollieClient({ apiKey: MOLLIE_API_KEY })

  
  return {
    mollie_client,
  }

}
