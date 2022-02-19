module.exports = {


  // In this script we handle updates to the 'livestream'.

  async afterUpdate(event) {


    // We inform all connected socket clients of this new info.
    // the frontend of this project hanndles the rest.

    strapi.io
    .emit(
      'streamUpdate', 
      event.result.publicData
    )

  }

}
