import store from '@/store'
import app from '@/main'

const 


  // Before accessing the homepage, we make sure that 
  // we have all the events from Strapi, to list them.

  before_enter_home = async () => {
    try {
      await store.dispatch( 'events/get_events' )
    } catch ( error ) {
      return '404'
    }
  },


  // Before accessing an event page, we get (and maybe
  // fetch) the event from the store (and maybe api) to
  // check if it exists (and load it if it doesn't).

  before_enter_event = async to => {
    const slug = to.params.slug 
    try {
      const event = await store.dispatch( 'events/get_event', slug )
      const vieweers = await store.dispatch( 'viewers/get_viewers', event.id )
      const messages = await store.dispatch( 'messages/get_messages', event.id )
    } catch ( error ) {
      return '404'
    }
    const socket = app.config.globalProperties.$socket.client
    socket.connect()
  }


export default {
  before_enter_home,  
  before_enter_event,
}
