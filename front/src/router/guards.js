import store  from '@/store'
import _throw from './throw'

const 

  dispatch = store.dispatch,


  // Before accessing the homepage, we make sure that 
  // we have all the events from Strapi, to list them.

  before_enter_home = async () => {
    try {
      await dispatch( 'events/get_events' )
    } catch ( error ) {
      return _throw( error )
    }
  },


  // Before accessing an event page, we get (and maybe
  // fetch) the event from the store (and maybe api) to
  // check if it exists (and load it if it doesn't).

  before_enter_event = async to => {
    const slug = to.params.slug 
    try {
      const 
        livestream = await dispatch( 'livestream/get_livestream' ),
        event      = await dispatch( 'events/get_event', slug ),
        viewers    = await dispatch( 'viewers/get_viewers', event.id ),
        messages   = await dispatch( 'messages/get_messages', event.id ),
        announces  = await dispatch( 'announcements/get_announcements', event.id )
    } catch ( error ) {
      return _throw( error )
    }
  }


export default {
  before_enter_home,  
  before_enter_event,
}
