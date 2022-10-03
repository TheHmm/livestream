import axios   from 'axios'
import config  from '@/config'
import $log    from '@/utils/log'
import $time   from '@/utils/time'

export default {


  // This method counts our events before fetching them
  // See: back/src/api/event/controllers/event.js

  count() {
    $log.info( `API`, `Counting events.` )
    return new Promise( ( resolve, reject ) => {
      axios
      .get( `${ config.api_url }/events/count` )
      .then( result => resolve( result.data ) )
      .catch( error => {
        $log.error( 'API', error )
        reject( error )
      } )
    } )
  },


  // Fetch all events; sort in reverse chronological
  // order (i.e. most recent event first).

  getAll() {
    $log.info( `API`, `Fetching events.` )
    return new Promise( ( resolve, reject ) => {
      axios
      .get( `${ config.api_url }/events`, { params: {
        sort: 'starts:asc',
        filters: {
          ends: {
            $lt: $time.now()
          },
        },
        fields: [
          'title',
          'slug',
          'starts',
          'ends',
          'accent',
          'info',
          'mux_recording'
        ],
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
  }

}
