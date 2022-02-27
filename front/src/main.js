import { createApp }         from 'vue'
import router                from './router'
import store                 from './store'
import config                from './config'
import { logger, $id, network } from './utils'


import { createMetaManager } from 'vue-meta'
// import VueMarkdownIt         from 'vue3-markdown-it'
// import marked from 'marked'
import smoothscroll          from 'smoothscroll-polyfill'

import axios from 'axios'
import socket                from 'socket.io-client'
import VueSocketIOExt        from 'vue-socket.io-extended'

import App                   from './App.vue'

logger.intro( config )

const app = createApp( App )

// Smooth scrolling on older browsers.

smoothscroll.polyfill()


// Set default options of markdown parser.

// VueMarkdownIt.props = { 
//   ...VueMarkdownIt.props, 
//   ...config.md 
// }

// Network monitoring

const io = socket.io( config.socketURL )



network.init( axios, io )

// Registering extensions and mounting app.

app.config.globalProperties = { logger, $id }

app
// .use( VueMarkdownIt )
.use( VueSocketIOExt, io, { store } )
.use( store )
.use( router )
.use( createMetaManager() )
.mount( '#app' )

console.log(app.config.globalProperties.$socket.client.emit)
