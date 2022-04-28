import guards from './guards'
import _throw from './throw'

export default [


  // Defining our routes; note the route for '/:slug' :
  // it is meant to route to events based on their slug,
  // which are created in and fetched from Strapi.

    // {
    //   path: '/',
    //   name: 'home',
    //   component: () => import( '@/views/Home.vue' ),
    //   beforeEnter: guards.before_enter_home
    // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import( '@/views/About.vue' )
  // },
  {
    path: '/error',
    name: 'Error',
    component: () => import( '@/views/Fallback.vue' )
  },
  {
    path: '/:slug',
    name: 'Event',
    component: () => import( '@/views/Event/index.vue' ),
    beforeEnter: guards.before_enter_event,
    children: [
      {
        path: '',
        name: 'Livestream',
        component: () => import( '@/views/Event/Livestream.vue' )
      },
      {
        path: 'chat',
        name: 'ChatPage',
        component: () => import( '@/views/Event/Chat.vue' )
      },
      {
        path: 'accent',
        name: 'Accent',
        component: () => import( '@/views/Event/Accent.vue' )
      }
    ]
  },
  {
    path: '/donated',
    name: 'Donated',
    component: () => import( '@/views/Donated.vue' ),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: {
      name: 'Error',
      query: { type: 'Request failed with status code 404' }
    }
  }
]
