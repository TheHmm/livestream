import axios   from 'axios'
import config  from '@/config'
import $log    from '@/utils/log'
import $time   from '@/utils/time'

export default {


  // This method counts our events before fetching them
  // See: back/src/api/event/controllers/event.js

  count( time ) {
    $log.info( `API`, `Counting events.` )
    let filters
    if ( time == 'past' ) {
      filters = {
        ends: {
          $lt: $time.now()
        },
        show_in_archive: {
          $eq: true,
        }
      }
    } else {
      filters = {
        starts: {
          $gte: $time.now(),
        },
        show_in_agenda: {
          $eq: true,
        }
      }
    }
    return new Promise( ( resolve, reject ) => {
      axios
      .get( `${ config.api_url }/events/count`, { params: { filters } } )
      .then( result => resolve( result.data ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    } )
  },


  // Fetch all events; sort in reverse chronological
  // order (i.e. most recent event first).

  getPast() {
    $log.info( `API`, `Fetching past events.` )
    return new Promise( ( resolve, reject ) => {
      axios
      .get( `${ config.api_url }/events`, { params: {
        sort: 'starts:asc',
        filters: {
          ends: {
            $lt: $time.now()
          },
          show_in_archive: {
            $eq: true,
          }
        },
        fields: [
          'title',
          'slug',
          'starts',
          'ends',
          'accent',
          'info',
          'mux_recording',
        ],
        populate: [
          'organisation',
          'organisation.Logo',
        ],
        pagination: {
          pageSize: 100,
        }
      } } )
      .then( result => resolve( result.data.data ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    } )
  },


  // Fetch futuer events; sort in reverse chronological
  // order (i.e. most recent event first).

  getFuture() {
    $log.info( `API`, `Fetching future events.` )
    return new Promise( ( resolve, reject ) => {
      axios
      .get( `${ config.api_url }/events`, { params: {
        sort: 'starts:asc',
        filters: {
          starts: {
            $gte: $time.now(),
          },
          show_in_agenda: {
            $eq: true,
          }
        },
        fields: [
          'title',
          'slug',
          'starts',
          'ends',
          'accent',
          'info',
          'mux_recording',
          'show_in_agenda',
        ],
        populate: [
          'organisation',
        ],
        pagination: {
          pageSize: 100,
        }
      } } )
      .then( result => resolve( result.data.data ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    } )
  },


  // Fetch event by slug. Non-standard implementation
  // See: back/src/api/event/controllers/event.js

  get( slug ) {
    $log.info( `API`, `Fetching event ${ slug }.` )
    return new Promise( ( resolve, reject ) => {
      axios
      .get(
        `${ config.api_url }/events/${ slug }`, { params: {
          fields: '*',
          populate: [
            'emoji_groups',
            'emoji_groups.emoji',
            'emoji_groups.emoji.image',
          ]
        } } )
      .then( result => resolve( result.data.data ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    } )
  },


  // Log event visit in custom strapi route /log-visit

  log_visit( slug ) {
    $log.info( `API`, `Logging visit for event ${ slug }.` )
    return new Promise( ( resolve, reject ) => {
      axios
      .patch( `${ config.api_url }/events/${ slug }/visit` )
      .then( result => resolve( result.data ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    } )
  },


}
