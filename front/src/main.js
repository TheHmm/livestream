import axios           from 'axios'
import socket          from 'socket.io-client'
import VueSocketIOExt  from 'vue-socket.io-extended'

import { createApp }   from 'vue'
import App             from './App.vue'

import router          from './router'
import store           from './store'
import config          from './config'
import networking      from './networking'
import { logger }      from './utils'
import { $id }         from './utils'
import { $md, $mdi }  from './utils'

const


  // We log default config to console
  // & instantiate socket cient
  // & instantiate networking scripts
  // & create vue app
  
  intro = logger.intro( config ),
  io    = socket.io( config.socket_url, { autoConnect: false } ),
  net   = networking.init( axios, io ),
  app   = createApp( App )


// We register extensions and mounting app.

app.config.globalProperties = { 
  logger, 
  $id,
  $md,
  $mdi
}

// router.isReady().then( () => {
  app
  .use( VueSocketIOExt, io, { store } )
  .use( store )
  .use( router )
  .mount( '#app' )
// })




export default app
