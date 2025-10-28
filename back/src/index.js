'use strict';

const { viewer_hooks } = require('./hooks/viewer')
const { event_hooks } = require('./hooks/event')
const { announcement_hooks } = require('./hooks/announcement')
const { livestream_hooks } = require('./hooks/livestream')
const { message_hooks } = require('./hooks/message')
const { meta_hooks } = require('./hooks/meta')

module.exports = {


  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */

  register({ strapi }) {


    // register lifecycle hooks for all routes and queries

    [
      viewer_hooks,
      event_hooks,
      announcement_hooks,
      livestream_hooks,
      message_hooks,
      meta_hooks
    ].forEach( middleware => strapi.documents.use(middleware()))

  },

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

      MQTT_COFNIG    = {
        HOST         : process.env.MQTT_HOST,
        TOPIC        : process.env.MQTT_TOPIC,
      }



    // We can only initialize MUX if MUX_TOKEN_ is provided;
    // else, we stop here and ask for MUX_TOKEN_ details.

    if (
        !MUX_CONFIG.ID ||
        !MUX_CONFIG.SECRET
    ) {
      throw new Error( 'MUX API TOKEN NOT PROVIDED!' )
    }


    // We import and initialize our MUX, MOLLIE & IO modules.
    // These files contain the respecitve configurations and
    // methods of these objects.

    const

      mux    = require( './mux' )( MUX_CONFIG ),
      io     = require( './io'  )( strapi.server.httpServer ),
      mqtt   = require( './mqtt' )( MQTT_COFNIG )


    // If either of the three were not initialized properly,
    // we stop here and return an error. MQTT is optional

    if ( !mux || !io ) {
      throw new Error(
        'MUX or IO were not initialized.'
      )
    }


    // We "register" these three objects onto our strapi
    // instance so that we can use them in controllers &
    // lifecycle hooks (eg. strapi.mux.get_start_time).

    strapi.mux    = mux
    strapi.io     = io
    strapi.mqtt   = mqtt


    try {
      // Run a raw SQL query to update the 'folder_path' field in the 'files' table
      await strapi.db.connection.raw(`
        UPDATE public.files 
        SET folder_path = '/' 
        WHERE folder_path IS NULL;
      `);

      // Log success message
      strapi.log.info('Successfully updated folder_path in files table where it was null.');
    } catch (error) {
      // Log error message in case of failure
      strapi.log.error('Error updating folder_path in files table: ', error);
    }


    // Our livestream initialization.

    let
      found,
      livestream


    // First we get the first 'livestream' from Strapi.
    // This entry will contain these two JSON feilds:
    // (1) privateData: livestream that we create with MUX
    // (2) publicData: a public-safe version of it

    try {
      found = await strapi.documents( 'api::livestream.livestream' ).findMany()


      // If the entry has already been created before, then
      // pull the livestream ID and request from the MUX API
      // the latest information about the stream.

      if ( found.length ) {

        strapi.log.info( 'Found existing livestreams. Updating them.' )

        found.map( async f => {
          const id = f.privateData.id
          const livestream = await mux.get_livestream( id )
                    
          // Then, we update the 'livestream' entry in Strapi
          // with the new or updated livestream object.

          await strapi.documents( 'api::livestream.livestream' ).update({
            documentId: f.documentId, 
            data: { livestream } 
          })

        })


      // Else, we request from the MUX API to create a new
      // livestream, using the options that we defined in the
      // 'mux.js' module.

      } else {
        strapi.log.info( 'Requesting new livestream.' )
        return await strapi.documents( 'api::livestream.livestream' ).create()

      }


    // It's possible something went wrong with MUX or
    // Strapi. We return here.

    } catch ( error ) {
      throw error
    }


  },
};
