import { createApp }  from 'vue'
import router         from './router'
import store          from './store'

import Axios          from 'axios'
import { io }         from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'
import VueMarkdownIt  from 'vue3-markdown-it'

import App            from './App.vue'

import smoothscroll   from 'smoothscroll-polyfill'

smoothscroll.polyfill()


const 
  
  url                = 'https://api.live.thehmm.karls.computer/',

  socketURL          = url,
  $apiURL            = url,
  
  markdownOptions    = {
    html             : true,
    linkify          : true,
    typographer      : true
  },
  
  globalProperties   = {
    $url             : url,
    $apiURL          : url,
    $http            : Axios,
    $mdOpts          : markdownOptions
  },

  app = createApp(App)


app.config.globalProperties = globalProperties

app
.use(VueSocketIOExt, io(socketURL), { store })
.use(VueMarkdownIt)
.use(store)
.use(router)
.mount('#app')
