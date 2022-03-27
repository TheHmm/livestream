
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
// * * * * * * * * * * * * The Hmm * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

import axios          from 'axios'
import socket         from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'

import { createApp }  from 'vue'
import App            from './App.vue'

import router         from './router'
import store          from './store'
import config         from './config'
import networking     from './networking'

import {
  $log,               // custom logger
  $time,              // handy date/time functions
  $id,                // generate id / class from comp namee
  $md,                // markdown parser
  $mdi,               // inline markdown parser
} from './utils'

const


  // We log default config to console
  // & instantiate socket cient
  // & instantiate networking scripts
  // & create vue app
  
  intro = $log.intro( config ),
  io    = socket.io( config.socket_url, { autoConnect: false } ),
  net   = networking.init( axios, io ),
  app   = createApp( App )


// We register extensions and mount app.

app.config.globalProperties = { 
  $log,
  $time,
  $id,
  $md,
  $mdi,
}

app
.use( VueSocketIOExt, io, { store } )
.use( store )
.use( router )
.mount( '#app' )


export default app
