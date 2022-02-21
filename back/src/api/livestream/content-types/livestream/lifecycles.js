const


  // in this funtion we break the livestream object
  // up into to components:
  // (1) privateData: the full livestream object
  // (2) publicData: it's poblically-safe counterpart

  sanitizeLivestream = ( event, strapi ) => {
    

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
        publicData  : strapi.mux.getPublicStreamDetails(livestream)
      }
    }


    // we log the STREAM-KEY to be able to access it

    strapi.log.info(`* STREAM KEY: ${livestream.stream_key}`)


  },




  // In this fuction we handle updates to the 'livestream'.
  // We inform all connected socket clients of this new info.
  // the frontend of this project hanndles the rest.

  afterUpdateHandler = async ( event, strapi ) => {
    
    strapi.io
    .emit(
      'streamUpdate', 
      event.result.publicData
    )
  
  }




module.exports = {


  beforeCreate(event) { sanitizeLivestream( event, strapi ) },
  beforeUpdate(event) { sanitizeLivestream( event, strapi ) },

  async afterUpdate(event) { await afterUpdateHandler( event, strapi ) }

}
