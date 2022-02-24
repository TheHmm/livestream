import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const router = createRouter( {
  history: createWebHistory( import.meta.env.BASE_URL ),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import( '../views/Home.vue' )
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
      beforeEnter: async to => {
        const slug = to.path.split( '/' )[ 1 ]
        try {
          await store.dispatch( 'events/get_event', slug )
        } catch ( error ) {
          console.error( `* ROUTER: Event page ${ slug } not found.` )
          return '404'
        }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: {
        name: 'Page Not Found'
      }
    }
  ],
} )

router.get_slugs = () => {
  return router
  .getRoutes()
  .map( r => r.path.replace( '/', '' ) )
}

export default router
