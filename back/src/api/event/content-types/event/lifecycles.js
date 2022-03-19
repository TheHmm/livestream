const { difference } = require('../../../../utils')

module.exports = {


  // In this function we handle updates to the 'event'.
  // We inform all connected socket clients of new info.
  // the frontend of this project hanndles the rest.

  async beforeUpdate( event ) { 


    // We get our new entry from event payload and our old
    // one from Strapi.

    const
      params    = event.params,
      id        = params.where.id,
      new_event = params.data,
      slug      = params.data.slug,      
      api       = strapi.service( 'api::event.event' ),
      old_event = await api.findOne( id, params ),

    
      // We get the updates to the entry using difference
      // function: @/back/src/utils.js

      diff      = difference( old_event, new_event )

      
    // We delete confused differences from our diff object.
    // Strapi is excluding the id when we use the findOne()
    // function as well as returning dates as a string (and
    // not an object)

    delete diff.id
    delete diff.createdAt
    delete diff.publishedAt
    delete diff.createdBy
    delete diff.updatedBy

    diff.slug = slug
      
    
    // move /front/src/api/events/sanitize to here
    




    
    // If the update was meant to trigger a one off func
    // in the front end (e.g. highlighting donate button)
    // we switch it back off in Strapi.

    if ( diff.highlightDonateButton === true ) {
      new_event.highlightDonateButton = false
    }
    

    console.log( diff ) 
    strapi.io.emit( 'event_update', diff )


  },

}
