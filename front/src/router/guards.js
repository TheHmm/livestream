import store from '@/store'
import app from '@/main'
import _throw from './throw'

const 

  // Before accessing the homepage, we make sure that 
  // we have all the events from Strapi, to list them.

  before_enter_home = async () => {
    try {
      await store.dispatch( 'events/get_events' )
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
      await store.dispatch( 'livestream/get_livestream' )
      const event = await store.dispatch( 'events/get_event', slug )
      await store.dispatch( 'viewers/get_viewers', event.id )
      await store.dispatch( 'messages/get_messages', event.id )
      await store.dispatch( 'announcements/get_announcements', event.id )
      const socket = app.config.globalProperties.$socket.client
      socket.connect()
    } catch ( error ) {
      return _throw( error )
    }
  }


export default {
  before_enter_home,  
  before_enter_event,
}
