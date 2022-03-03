const


  // In this function we handle newly created mux hooks.
  // This updates the 'livestream' entry in our database.

  afterCreateHandler = async ( event, strapi ) => {


    // From the mux event's payload, we get the livestream's 
    // new status (e.g. 'idle' or 'active' ).

    const 

      data   = event.result.event,
      status = data.status
 

    // We get the exisitng livestream from strapi.

    await strapi
    .service('api::livestream.livestream')
    .find()
    .then( async response => {


      // We set the livestream to the old, unsanitized, version
      // of itself that was stored on mux

      const livestream = response?.privateData


      // We update the status of the livestream object with the
      // new status received from the mux hook.

      livestream.status = status


      // If the livestream has arrived at an 'idle' state, the 
      // event payload will additionally carry an array of recent
      // asset IDs, so we add this to our updated object.

      if (status == 'idle') {
        livestream.recent_asset_ids = data.recent_asset_ids
      }


      // We update the 'livestream' entry in Strapi with this 
      // new information.

      await strapi
      .service('api::livestream.livestream')
      .createOrUpdate({
        data: { livestream }
      })
      

    })

    
  // We still have to inform connected sockets of this change,
  // so we continue in the appropriate place:
  // back/src/api/livestream/content-types/livestream/lifecycles.js
    
  }



module.exports = {
  
  async afterCreate(event) { await afterCreateHandler( event, strapi ) }

}
