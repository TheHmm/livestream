const random_animal_name = require("random-anonymous-animals")

module.exports = {

  // '*/10 * * * * *': async ({ strapi }) => { // dev: every 3 seconds
  '58 14 * * *': async ({ strapi }) => { // dev: every day at midnight
  // '0 0 * * *': async ({ strapi }) => { // prod: every day at midnight

    strapi.log.info(`[ * * * * * * * * * * * * * * * * * * * ]`)
    strapi.log.info(`[ * * * NIGHTLY CRON JOB STARTING * * * ]`)
    strapi.log.info(`[ * * * * * * * * * * * * * * * * * * * ]`)

    const now = new Date()

    await viewer_anonymization( strapi, now )
    await event_post_processor( strapi, now )

    strapi.log.info(`[ * * * * * * * * * * * * * * * * * * * ]`)

  },

}






/**
 * Iterates over all viewers in strapi and anonymizes those
 * that have requested their anonymization to happen before
 * this date.
 *
 * @param { object } strapi strapi instance
 * @param { date   } now    current datetime
 */

async function viewer_anonymization( strapi, now ) {

  strapi.log.info(`[ * => VIEWER ANONYMIZATION * * * * * * ]`)
  const viewer_service = strapi.service('api::viewer.viewer')


  // First, we get all viewers that expire before today. This
  // filter returns only valid dates that are less than today.

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


    // We iterate over the list of viewers, creating a new
    // anonymous animal name for each one that wanted to be
    // anonymized and setting it's expiration to null so that
    // it is ignored by the filter later on.

    // NOTE: This changing of name also regenerates the UUID
    // field for viewers, since in Strapi, if that is not set,
    // it will be generated based on the name field.

    // This is good, since the UUID in the viewer's browser
    // is then forgotten by Strapi.

    for ( const { name, id } of viewers ) {
      const new_name = random_animal_name()
      strapi.log.info(`[ * ${ name } -> ${ new_name }`)
      await viewer_service.update( id, { data: {
        name    : new_name,
        expires : null
      } } )
    }

    strapi.log.info(`[ * * * * * * * * * * * * * * * * * * * ]`)

  } catch ( error ) {
    throw error
  }

}







/**
 * Iterates over all events from Strapi and if event is last
 * and is in past, sets the event viewer count and sets the
 * appropriate livestream asset.
 *
 * @param { object } strapi strapi instance
 * @param { date   } now    current datetime
 * @returns
 */

async function event_post_processor( strapi, now ) {

  strapi.log.info(`[ * => EVENT POST PROCESSOR * * * * * * ]`)

  const livestream_service = strapi.service('api::livestream.livestream')
  const event_service      = strapi.service('api::event.event')

  try {


    // We first get our current livestream config from Strapi.
    // If this is not yet defined then we stop here as it's
    // not important to run this function.

    const livestream = await livestream_service.find()
    if ( !livestream.publicData ) { return }


    // We get all our events from strapi in descending order.
    // This lets us to iterate over them in a way that prior-
    // itizes most recent events.

    const { results: events } = await event_service.find({
      pagination: {
        start: 0,
        limit: 500,
      },
      sort: 'starts:desc',
    })


    //

    for ( let i = 0; i < events.length; i++ ) {

      const event      = events[i]
      const is_last    = i == 0
      const is_in_past = new Date( event.ends ) <= now

      if ( is_last && is_in_past ) {

        strapi.log.info(`[ * Processing event: ${ event.title }`)

        console.log(event)

        if ( !event.count ) {
          event.count = get_max_count( strapi, event )
          strapi.log.info(`[ * Count: ${ event.count }`)
        }

        if ( !event.livestream ) {
          const asset_id = most_recent_asset_id( livestream.privateData )
          strapi.log.info(`[ * Asset ID: ${ asset_id }`)
          if ( asset_id ) {
            try {
              const asset = await strapi.mux.get_asset( asset_id )
              event.livestream = strapi.mux.get_public_asset_details( asset )
              strapi.log.info(`[ * Playback ID: ${ event.livestream.playbackId }`)
            } catch ( err ) {
              err.asset_id = asset_id
              console.error(err)
            }
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




function get_max_count( strapi, event ) {
  let count
  if ( strapi.io.counts.length ) {
    count = Math.max.apply( null, strapi.io.counts )
    strapi.io.counts.length = 0
  } else {
    count = event.viewers.length
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
