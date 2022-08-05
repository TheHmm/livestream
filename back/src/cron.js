const random_animal_name = require("random-anonymous-animals")

module.exports = {

  // '*/10 * * * * *': async ({ strapi }) => { // dev: every 3 seconds
  '34 17 * * *': async ({ strapi }) => { // dev: every day at midnight
  // '0 0 * * *': async ({ strapi }) => { // prod: every day at midnight

    await viewer_anonymization( strapi )
    await event_post_processor( strapi )
    // await put_transcript_vocab( strapi )


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


  const now = new Date()
  const livestream_service = strapi.service('api::livestream.livestream')
  const event_service = strapi.service('api::event.event')

  try {

    const livestream = await livestream_service.find()

    if ( !livestream.publicData ) {
      return
    }

    const { results: events } = await event_service.find({
      pagination: {
        start: 0,
        limit: 500,
      },
      sort: 'starts:desc',
    })

    for ( let i = 0; i < events.length; i++ ) {

      const event      = events[i]
      const is_last    = i == 0
      const is_in_past = new Date( event.ends ) <= now

      if ( is_last ) {
        if ( is_in_past ) {

          if ( !event.count ) {
            event.count = get_max_count( strapi )
          }

          const asset_id = most_recent_asset_id( livestream.privateData )

          if ( asset_id ) {
            try {
              const asset = await strapi.mux.get_asset( asset_id )
              if ( !event.livestream ) {
                console.log(asset)
                event.livestream = strapi.mux.get_public_asset_details( asset )
              }
            } catch ( err ) {
              err.asset_id = asset_id
              console.error(err)
            }

          }

        }
      }

      await event_service.update( event.id , { data: event } )
    }



  } catch ( error ) {
    throw error
  }

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


function get_max_count( strapi ) {
  let count
  if ( strapi.io.counts.length ) {
    count = Math.max.apply( null, strapi.io.counts )
    strapi.io.counts.length = 0
  }
  return count
}


function most_recent_asset_id ( livestream ) {
  let most_recent_asset
  const {
    active_asset_id,
    recent_asset_ids
  } = livestream
  if ( active_asset_id ) {
    most_recent_asset = active_asset_id
  } else if ( recent_asset_ids && recent_asset_ids.length ) {
    most_recent_asset = recent_asset_ids[ recent_asset_ids.length - 1 ]
  }
  return most_recent_asset
}
