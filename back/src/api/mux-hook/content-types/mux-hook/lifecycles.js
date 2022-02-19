module.exports = {


  // in this script we handle newly created mux hooks.
  // this updates the 'livestream' entry in our database

  async afterCreate(event) {

    // From the mux event's body, we get the livestream's new
    // status ( 'idle' or 'active' ).

    const 

      data   = event.result.event,
      status = data.status
      
    if ( status == 'idle' || status == 'active' ) {

      
      // dfvdfdvfdfvd

      let livestream
      

        // get exisitng livestream from strapi

        await strapi
        .service('api::livestream.livestream')
        .find()
        .then( async response => {

          livestream = response?.privateData
          livestream.status = status


          // if the livestream has arrived at an 'idle' state, the 
          // event payload will additionally carry an array of recent
          // asset IDs, so we add this to our updated object.

          if (status == 'idle') {
            livestream.recent_asset_ids = data.recent_asset_ids
          }


          // We update the 'livestream' entry in Strapi with this 
          // new information.

          console.log(livestream)

          await strapi
          .service('api::livestream.livestream')
          .createOrUpdate({
            data: {
              privateData : livestream,
              publicData  : strapi.mux.getPublicStreamDetails(livestream)
            }
          })
          

        })


        // our updated livestream will at least have a new value 
        // for its 'status' key.

        
      }
    

    // We still have to inform connected sockets of this change,
    // so we continue in the appropriate place:
    // back/src/api/livestream/content-types/livestream/lifecycles.js

  }

}
