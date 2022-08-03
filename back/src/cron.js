const random_animal_name = require("random-anonymous-animals")

module.exports = {

  // '*/3 * * * * *': async ({ strapi }) => { // testing , every 3 seconds
  '0 0 * * *': async ({ strapi }) => { // every day at midnight

    await viewer_anonymization( strapi )
    // await event_post_processor( strapi )


  },

}




async function viewer_anonymization( strapi ) {

  const now = new Date()
  const viewer_service = strapi.service('api::viewer.viewer')

  try {
    const { results: viewers } = await viewer_service.find({
      pagination: {
        start: 0,
        limit: 500,
      },
      filters: {
        expires: {
          $lt: now.toISOString(),
        }
      }
    })

    console.log(viewers)

    for ( const { id } of viewers ) {
      await viewer_service.update( id, { data: {
        name : random_animal_name(),
        expires : null
      } } )
    }

  } catch ( error ) {
    throw error
  }

}



async function event_post_processor( strapi ) {

  // get events from strapi
  // for event in events {
    // if event is last {
      // if event is in past {
        // if no event count {
          // get viewer count from strapi
          // set count to event object
          // update event in strapi
          // clear count in strapi
        // }
        // if no event recording {
          // get livestream asset id from strapi
          // request mux recording
          // request mux srt file
          // set recoring and srt to event in strapi
        // }
      // } else if event is in future {
          // get livestream from strapi
          // set event livestream
          // update event in strapi
      // }
    // }
  // }




}
