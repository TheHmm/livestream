
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * The Hmm * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

import axios          from 'axios'
import VueSocketIOExt from 'vue-socket.io-extended'
import vClickOutside  from 'v-click-outside'

import { createApp }  from 'vue'
import App            from './App.vue'

import router         from './router'
import store          from './store'
import config         from './config'
import networking     from './networking'

import {
  $log,            // custom logger
  $time,           // handy date/time functions
  $id,             // generate id / class from comp name
  $md,             // markdown parser
  $mdi,            // inline markdown parser
  $throttle,       // throttle functions
  $socket,         // our socket io client instance
  _throw           // custom error thrower
} from './utils'


// We log default config to console
$log.intro( config )


// & instantiate networking scripts
networking.init( axios, $socket )


// & create vue app
const app = createApp( App )


// & register extensions and mount app.
app.config.globalProperties = { $log, $time, $id, $md, $mdi, $throttle }


// & attach our extensions to our app
app.use( store ).use( router ).use( VueSocketIOExt, $socket, { store } ).use( vClickOutside )


// & finally mount after the router is ready
router.isReady().then( () => app.mount( 'body' ) )
