import { createApp }  from 'vue'
import router         from './router'
import store          from './store'

import { io }         from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'
import VueMarkdownIt  from 'vue3-markdown-it'
import smoothscroll   from 'smoothscroll-polyfill'

import App            from './App.vue'


const 

  $socketURL         = import.meta.env.VITE_APP_SOCKET_URL,

  $mdOpts            = {
    html             : true,
    linkify          : true,
    typographer      : true
  },

  app = createApp(App)

smoothscroll
.polyfill()

app
.config
.globalProperties    = {
  $socketURL,
  $mdOpts,
},

app
.use(
  VueSocketIOExt, 
  io($socketURL), 
  { store }
)
.use(VueMarkdownIt)
.use(store)
.use(router)
.mount('#app')
