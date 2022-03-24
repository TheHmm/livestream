import { createStore } from 'vuex'

import meta          from './meta'
import networking    from './networking'
import livestream    from './livestream'
import events        from './events'
import viewers       from './viewers'
import messages      from './messages'
import announcements from './announcements'

export default createStore({

  strict: process.env.NODE_ENV !== 'production',

  modules: {
    meta,
    networking,
    livestream,
    events,
    viewers,
    messages,
    announcements
  },


})
