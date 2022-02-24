import { createApp }         from 'vue'
import router                from './router'
import store                 from './store'
import config                from './config'
import utils                 from './utils'

import { createMetaManager } from 'vue-meta'
import VueMarkdownIt         from 'vue3-markdown-it'
import smoothscroll          from 'smoothscroll-polyfill'

import { io }                from 'socket.io-client'
import VueSocketIOExt        from 'vue-socket.io-extended'

import App                   from './App.vue'


const 

  socketURL = import.meta.env.VITE_APP_SOCKET_URL,


  init = async () => {


    // We fetch all the events from strapi before mounting
    // our app so that routes for each event can be built
    // in to our router's beforeEach() filter.
    
    // await store.dispatch( 'events/fetch_events' )


    // We combine the paths of the routes defined in our
    // router with the slugs of each of the events into
    // an array of valid slugs to test against.

    // router.beforeEach(to => {

    //   const 
    //     path         = to.path.split( '/' )[ 1 ],
    //     router_slugs = router.get_slugs(),
    //     event_slugs  = store.getters[ 'events/event_slugs' ],
    //     valid_slugs  = [ ...router_slugs, ...event_slugs ]

    //     console.log(valid_slugs)

    //   if ( !valid_slugs.includes( path ) ) {
    //     return '404'
    //   }

    // })


    // Smooth scrolling on older browsers.

    smoothscroll.polyfill()


    // Set default options of markdown parser.

    VueMarkdownIt.props = { ...VueMarkdownIt.props, ...config.md }


    // await router.isReady()

    const app = createApp(App)

    // Registering extensions and mounting app.

    app.config.globalProperties = {
      $id: utils.$id
    }

    app
    .use( VueMarkdownIt )
    .use( VueSocketIOExt, io( socketURL ), { store } )
    .use( store )
    .use( router )
    .use( createMetaManager() )
    .mount( '#app' )

  }

init()
