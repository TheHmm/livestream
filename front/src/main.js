import { createApp }         from 'vue'
import router                from './router'
import store                 from './store'
import config                from './config'
import { logger, $id }       from './utils'

import { createMetaManager } from 'vue-meta'
// import VueMarkdownIt         from 'vue3-markdown-it'
import smoothscroll          from 'smoothscroll-polyfill'

import { io }                from 'socket.io-client'
import VueSocketIOExt        from 'vue-socket.io-extended'

import App                   from './App.vue'

logger.intro( config )

const app = createApp( App )

// Smooth scrolling on older browsers.

smoothscroll
.polyfill()


// Set default options of markdown parser.

// VueMarkdownIt.props = { 
//   ...VueMarkdownIt.props, 
//   ...config.md 
// }


// Registering extensions and mounting app.

app.config.globalProperties = { logger, $id }

app
// .use( VueMarkdownIt )
.use( VueSocketIOExt, io( config.socketURL ), { store } )
.use( store )
.use( router )
.use( createMetaManager() )
.mount( '#app' )
