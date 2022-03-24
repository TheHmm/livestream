import guards from './guards'
import _throw from './throw'

export default [


  // Defining our routes; note the route for '/:slug' :
  // it is meant to route to events based on their slug,
  // which are created in and fetched from Strapi.

  // {
  //   path: '/',
  //   name: 'home',
  //   component: () => import( '../views/Home.vue' ),
  //   beforeEnter: guards.before_enter_home
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import( '../views/About.vue' )
  // },
  {
    path: '/error',
    name: 'Error',
    component: () => import( '../views/Fallback.vue' )
  },
  {
    path: '/:slug',
    name: 'event',
    component: () => import( '../views/Event.vue' ),
    beforeEnter: guards.before_enter_event,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: {
      name: 'Error',
      query: { type: '404' }
    }
  }
]
