const random_animal_name = require("random-anonymous-animals")

module.exports = {

  // '*/10 * * * * *': async ({ strapi }) => { // dev: every 3 seconds
  '24 15 * * *': async ({ strapi }) => { // dev: every day at midnight
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
 * Iterates over all past events from Strapi, sets the event
 * viewer count and the appropriate livestream asset.
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


    // We get all our past events from strapi in descending
    // order. This lets us to iterate over them starting with
    // the last event.

    const { results: events } = await event_service.find({
      sort: 'starts:desc',
      pagination: {
        start: 0,
        limit: 500,
      },
      filters: {
        ends: {
          $lt: now.toISOString(),
        }
      },
      populate: [
        'viewers'
      ],
    })


    // Loop: last event to happen is first in line (i == 0)/
    // We process the last event, but also address all other
    // events in the array in case they haven't been processed
    // yet.

    for ( let i = 0; i < events.length; i++ ) {

      const event   = events[i]
      const is_last = i == 0

      let changed

      strapi.log.info(`[ * Processing event: ${ event.title }`)


      // Processing last event.

      if ( is_last ) {


        // We get the max count of connect socks from strapi,
        // and clear it. In case there is none, we go for the
        // viewers array length.

        if ( !event.count ) {
          event.count = get_max_count( strapi ) || event.viewers.length
          strapi.log.info(`[ * Count: ${ event.count }`)
          changed = true
        }


        // We get the most recent asset from the livestream
        // object in Strapi. This is likely the asset of the
        // most recent event that took place. We try and get
        // the asset details from MUX and set them to the event
        // recording data. This officially marks our event is
        // recorded.

        if ( !event.livestream ) {
          const asset_id = most_recent_asset_id( livestream.privateData )
          strapi.log.info(`[ * Asset ID: ${ asset_id }`)
          if ( asset_id ) {
            try {
              const asset = await strapi.mux.get_asset( asset_id )
              event.livestream = strapi.mux.get_public_asset_details( asset )
              strapi.log.info(`[ * Playback ID: ${ event.livestream.playbackId }`)
              changed = true
            } catch ( err ) {
              err.asset_id = asset_id
              console.error(err)
            }
          }
        }


      // Processing all other events

      } else {


        // In case the event viewer count has not been set,
        // we skip the strapi socket count and go directly to
        // the event viewer count. The strapi socket count is
        // reserved for the most recent event and has been
        // cleared already.

        if ( !event.count ) {
          event.count = event.viewers.length
          strapi.log.info(`[ * Count: ${ event.count }`)
          changed = true
        }


        // In case the event doesnt have a livestream recording
        // set yet, this is impossible to automate, so we go
        // for a warning to set it manually.

        if ( !event.livestream ) {
          strapi.log.warn(`[ * Event has no recording, please set manually`)
        }

      }


      // We only update the event in Strapi if its changed.

      if ( changed ) {
        await event_service.update( event.id , { data: event } )
        changed = false
      }

      strapi.log.info(`[ * * * * * * * * * * * * * * * * * * * ]`)

    }

    strapi.log.info(`[ * * * * * * * * * * * * * * * * * * * ]`)

  } catch ( error ) {
    throw error
  }

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
