
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
  $id,                // generate id / class from comp name
  $md,                // markdown parser
  $mdi,               // inline markdown parser
} from './utils'


// We log default config to console
// & instantiate socket cient
// & instantiate networking scripts
// & create vue app

$log.intro( config )
const io = socket.io( config.socket_url, { autoConnect: false } )
networking.init( axios, io )
const app = createApp( App )


// We register extensions and mount app.

app.config.globalProperties = {
  $log,
  $time,
  $id,
  $md,
  $mdi,
}


app
.use( store )
.use( router )
.use( VueSocketIOExt, io, { store } )

router.isReady().then( () => app.mount( '#app' ) )
