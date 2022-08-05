const random_animal_name = require("random-anonymous-animals")

module.exports = {

  // '*/10 * * * * *': async ({ strapi }) => { // dev: every 3 seconds
  '07 20 * * *': async ({ strapi }) => { // dev: every day at midnight
  // '0 0 * * *': async ({ strapi }) => { // prod: every day at midnight

    strapi.log.info(`[ * * * * * * * * * * * * * * * * * * * ]`)
    strapi.log.info(`[ * * * NIGHTLY CRON JOB STARTING * * * ]`)
    strapi.log.info(`[ * * * * * * * * * * * * * * * * * * * ]`)

    await viewer_anonymization( strapi )
    await event_post_processor( strapi )
    await cc_vocabulary_update( strapi )

    strapi.log.info(`[ * * * * * * * * * * * * * * * * * * * ]`)

  },

}




async function viewer_anonymization( strapi ) {

  strapi.log.info(`[ * => VIEWER ANONYMIZATION * * * * * * ]`)

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

    for ( const { name, id } of viewers ) {
      const new_name = random_animal_name()
      strapi.log.info(`[ * ${ name } -> ${ new_name }`)
      await viewer_service.update( id, { data: {
        name : new_name,
        expires : null
      } } )
    }

    strapi.log.info(`[ * * * * * * * * * * * * * * * * * * * ]`)

  } catch ( error ) {
    throw error
  }

}





async function event_post_processor( strapi ) {

  strapi.log.info(`[ * => EVENT POST PROCESSOR * * * * * * ]`)

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

      if ( is_last && is_in_past ) {

        strapi.log.info(`[ * Processing event: ${ event.title }`)

        if ( !event.count ) {
          event.count = get_max_count( strapi )
          strapi.log.info(`[ * Count: ${ event.count }`)
        }

        const asset_id = most_recent_asset_id( livestream.privateData )
        strapi.log.info(`[ * Asset ID: ${ asset_id }`)

        if ( asset_id ) {
          try {
            const asset = await strapi.mux.get_asset( asset_id )
            if ( !event.livestream ) {
              event.livestream = strapi.mux.get_public_asset_details( asset )
              strapi.log.info(`[ * Playback ID: ${ event.livestream.playbackId }`)
            }
          } catch ( err ) {
            err.asset_id = asset_id
            console.error(err)
          }

        }

        await event_service.update( event.id , { data: event } )

      }

    }

    strapi.log.info(`[ * * * * * * * * * * * * * * * * * * * ]`)

  } catch ( error ) {
    throw error
  }

}



async function cc_vocabulary_update ( strapi ) {
  strapi.log.info(`[ * => CC VOCABULARY UPDATE * * * * * * ]`)
  strapi.log.info(`[ * * * * * * * * * * * * * * * * * * * ]`)
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
