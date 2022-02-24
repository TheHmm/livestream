import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

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


  // 

  beforeEnterHome = async () => {
    try {
      const events = await store.dispatch( 'events/get_events' )
      console.log(events)
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
      console.error( `* ROUTER: Event page ${ slug } not found.`, error )
      return '404'
    }
  }


export default router
