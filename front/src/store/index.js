import { createStore } from 'vuex'

import ui              from './ui'
import networking      from './networking'

import livestream      from './livestream'
import events          from './events'

import viewers         from './viewers'
import messages        from './messages'
import announcements   from './announcements'

export default createStore({

  strict: process.env.NODE_ENV !== 'production',

  modules: {

    ui,
    networking,

    livestream,
    events,

    viewers,
    messages,
    announcements
  },


})
