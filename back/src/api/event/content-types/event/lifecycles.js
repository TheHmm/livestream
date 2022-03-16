module.exports = {


  // In this function we handle updates to the 'event'.
  // We inform all connected socket clients of new info.
  // the frontend of this project hanndles the rest.

  afterUpdate( event ) { 
    strapi.io.emit( 'event_update', event.result )
  },

}
