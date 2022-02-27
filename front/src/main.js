import axios           from 'axios'
import socket          from 'socket.io-client'
import VueSocketIOExt  from 'vue-socket.io-extended'

import { createApp }   from 'vue'
import App             from './App.vue'

import router          from './router'
import store           from './store'
import config          from './config'
import networking      from './networking'
import { logger, $id } from './utils'


const

  // Log default config to console
  intro    = logger.intro( config ),

  // Instantiate socket cient
  io       = socket.io( config.socket_url ),

  // Instantiate networking scripts
  monitors = networking.init( axios, io ),

  // Create vue app
  app      = createApp( App )


// Registering extensions and mounting app.

app
.config
.globalProperties = { 
  logger, 
  $id 
}

app
.use( VueSocketIOExt, io, { store } )
.use( store )
.use( router )
.mount( '#app' )


// import VueMarkdownIt         from 'vue3-markdown-it'
// import marked from 'marked'

// Set default options of markdown parser.

// VueMarkdownIt.props = { 
//   ...VueMarkdownIt.props, 
//   ...config.md 
// }

// .use( VueMarkdownIt )
