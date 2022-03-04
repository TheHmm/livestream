const


  // in this funtion we break the livestream object
  // up into to components:
  // (1) privateData: the full livestream object
  // (2) publicData: it's poblically-safe counterpart

  sanitize_livestream = ( event, strapi ) => {
    

    // we get the event payload

    const 
      data       = event.params.data,
      livestream = data.livestream


    // we merge the old "data" with the new saitzied one.
    // we conserve the old evet payload here because it 
    // contains strapi-generated metadata like "dateCreated"

    event.params.data = {
      ... data,
      ... {
        privateData : livestream,
        publicData  : strapi.mux.get_public_stream_details(livestream),
        stream_key  : livestream.stream_key
      }
    }


    // we log the STREAM-KEY to be able to access it

    strapi.log.info(`[ * STREAM KEY: ${livestream.stream_key} ]`)

  },




  // In this function we handle updates to the 'livestream'.
  // We inform all connected socket clients of this new info.
  // the frontend of this project hanndles the rest.

  after_update_handler = ( event, strapi ) => {
    
    strapi.io
    .emit( 
      'stream_update', 
      event.result.publicData 
    )
  
  },


  // After delete handler: we'll use Strapi's own delete
  // button to request a new livestream from MUX, this way
  // we can create a new livestream without needing to re-
  // boot the server
  
  after_delete_handler = async ( event, strapi ) => {

    strapi.log.info( 'Requesting new livestream.', event )
      
    try { 
      const livestream = await 
        strapi
        .mux
        .create_livestream()
      
      try {
        await strapi
        .service( 'api::livestream.livestream' )
        .createOrUpdate({
          data: { livestream }
        })
        
      } catch ( error ) {
        return strapi.log.error( 'strapi err', error )
      }
    
    } catch ( error ) {
      return strapi.log.error( 'mux err', error )
    }

  }




module.exports = {


  beforeCreate(event) { sanitize_livestream( event, strapi ) },
  beforeUpdate(event) { sanitize_livestream( event, strapi ) },

  afterUpdate(event) { after_update_handler( event, strapi ) },

  async afterDelete(event) { await after_delete_handler( event, strapi ) }

}
