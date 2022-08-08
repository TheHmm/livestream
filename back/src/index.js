'use strict';

module.exports = {


  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */


  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */


  async bootstrap(/*{ strapi }*/) {

    require( 'dotenv' ).config()


    // We get MUX_TOKEN_ details and the MOLLIE_CONFIG
    // from our .env file.

    const

      MUX_CONFIG     = {
        ID           : process.env.MUX_TOKEN_ID,
        SECRET       : process.env.MUX_TOKEN_SECRET
      },

      MOLLIE_CONFIG  = {
        KEY          : process.env.MOLLIE_API_KEY,
        REDIRECT_URL : process.env.MOLLIE_REDIRECT_URL,
        WEBHOOK_URL  : process.env.MOLLIE_WEBHOOK_URL
      }



    // We can only initialize MUX if MUX_TOKEN_ is provided;
    // else, we stop here and ask for MUX_TOKEN_ details.

    if (
        !MUX_CONFIG.ID ||
        !MUX_CONFIG.SECRET
    ) {
      throw new Error( 'MUX API TOKEN NOT PROVIDED!' )
    }


    // We can only initialize Mollie if the key is provided;
    // else, we stop here and ask for it.

    if (
        !MOLLIE_CONFIG.KEY ||
        !MOLLIE_CONFIG.REDIRECT_URL ||
        !MOLLIE_CONFIG.WEBHOOK_URL
    ) {
      throw new Error( 'MOLLIE API CONFIG NOT PROVIDED!' )
    }


    // We import and initialize our MUX, MOLLIE & IO modules.
    // These files contain the respecitve configurations and
    // methods of these objects.

    const

      mux    = require( './mux' )( MUX_CONFIG ),
      mollie = require( './mollie' )( MOLLIE_CONFIG ),
      io     = require( './io'  )( strapi.server.httpServer )


    // If either of the three were not initialized properly,
    // we stop here and return an error

    if ( !mux || !mollie || !io ) {
      throw new Error(
        'MUX, MOLLIE or IO objects were not initialized.'
      )
    }


    // We "register" these three objects onto our strapi
    // instance so that we can use them in controllers &
    // lifecycle hooks (eg. strapi.mux.get_start_time).

    strapi.mux    = mux
    strapi.mollie = mollie
    strapi.io     = io


    // Our livestream initialization.

    let
      found,
      livestream


    // First we get the 'livestream' entry from Strapi.
    // This entry will contain these two JSON feilds:
    // (1) privateData: livestream that we create with MUX
    // (2) publicData: a public-safe version of it

    try {
      found = await
      strapi
      .service( 'api::livestream.livestream' )
      .find()


      // If the entry has already been created before, then
      // pull the livestream ID and request from the MUX API
      // the latest information about the stream.

      const id = found ?.privateData ?.id

      if ( id ) {
        strapi.log.info( 'Found existing livestream.' )
        livestream = await mux.get_livestream( id )


      // Else, we request from the MUX API to create a new
      // livestream, using the options that we defined in the
      // 'mux.js' module.

      } else {
        strapi.log.info( 'Requesting new livestream.' )
        livestream = await mux.create_livestream()
      }


      // Then, we update the 'livestream' entry in Strapi
      // with the new or updated livestream object.

      return await
        strapi
        .service( 'api::livestream.livestream' )
        .createOrUpdate({ data: { livestream } })


    // It's possible something went wrong with MUX or
    // Strapi. We return here.

    } catch ( error ) {
      throw error
    }


  },
};
