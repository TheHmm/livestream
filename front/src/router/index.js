import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import { logger } from '../utils'

const 
  router = createRouter( {


    //     

    history: createWebHistory( import.meta.env.BASE_URL ),


    // Defining our routes; note the route for '/:slug' :
    // it is meant to route to events based on their slug,
    // which are created in and fetched from Strapi.

    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import( '../views/Home.vue' ),
        beforeEnter: async () => await beforeEnterHome()
      },
      {
        path: '/about',
        name: 'about',
        component: () => import( '../views/About.vue' )
      },
      {
        path: '/404',
        name: 'Page Not Found',
        component: () => import( '../views/404.vue' )
      },
      {
        path: '/:slug',
        name: 'event',
        component: () => import( '../views/Event.vue' ),
        beforeEnter: async to => await beforeEnterEvent( to.params.slug )
      },
      {
        path: '/:pathMatch(.*)*',
        redirect: {
          name: 'Page Not Found'
        }
      }
    ],

  } ),


  // Before accessing any page, we need to make sure we
  // have the livestream object

  beforeEach = async to => {
    try {
      await store.dispatch( 'livestream/get_livestream' )
    } catch ( error ) {
      return '404'
    }
  },


  // Before accessing the homepage, we make sure that 
  // we have all the events from Strapi, to list them.

  beforeEnterHome = async () => {
    try {
      await store.dispatch( 'events/get_events' )
    } catch ( error ) {
      return '404'
    }
  },


  // Before accessing an event page, we get (and maybe
  // fetch) the event from the store (and maybe api) to
  // check if it exists (and load it if it doesn't).

  beforeEnterEvent = async slug => {
    try {
      await store.dispatch( 'events/get_event', slug )
    } catch ( error ) {
      logger.error( `ROUTER`, `Event page ${ slug } not found.`, error )
      return '404'
    }
  }

  router.beforeEach( async to => await beforeEach( to ) )


export default router
