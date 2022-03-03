import guards from './guards'

export default [


  // Defining our routes; note the route for '/:slug' :
  // it is meant to route to events based on their slug,
  // which are created in and fetched from Strapi.

  {
    path: '/',
    name: 'home',
    component: () => import( '../views/Home.vue' ),
    beforeEnter: guards.before_enter_home
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
    beforeEnter: guards.before_enter_event,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: {
      name: 'Page Not Found'
    }
  }
]
