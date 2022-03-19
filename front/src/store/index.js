import { createStore } from 'vuex'

import meta            from './meta'
import ui              from './ui'
import networking      from './networking'

import livestream      from './livestream'
import events          from './events'

import viewers         from './viewers'
import messages        from './messages'
import announcements   from './announcements'

export default createStore({

  // strict mode is only enabled for dev environment.

  strict: process.env.NODE_ENV !== 'production',

  modules: {

    meta,
    ui,
    networking,

    livestream,
    events,

    viewers,
    messages,
    announcements
  },


})
