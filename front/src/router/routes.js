export default [


  // Defining our routes; note the route for '/:slug' :
  // it is meant to route to events based on their slug,
  // which are created in and fetched from Strapi.

  // desired_tabs: the names of the footer tabs that this
  // route displays.

  {
    path: '/',
    name: 'home',
    component: () => import( '@/views/Home.vue' ),
    meta: {
      desired_tabs : [
        'about',
        'access',
        'donate',
        'year',
      ]
    },
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import( '@/views/Fallback.vue' )
  },
  {
    path: '/donated',
    name: 'Donated',
    component: () => import( '@/views/Donated.vue' ),
  },
  {
    path: '/:slug',
    name: 'Event',
    component: () => import( '@/views/Event/index.vue' ),
    children: [
      {
        path: '',
        name: 'Livestream',
        component: () => import( '@/components/Livestream/index.vue' ),
        meta: {
          desired_tabs : [
            'about',
            'access',
            'donate',
            'modes',
            'emoji',
          ]
        },
      },
      {
        path: 'chat',
        name: 'ChatPage',
        component: () => import( '@/views/Event/Chat.vue' ),
        meta: {
          desired_tabs : [
            'about',
            'access',
            'donate',
            'modes',
            'emoji',
          ]
        },
        children: [
          // {
          //   path: 'save',
          //   name: 'ChatPageSave',
          //   component: () => import( '@/views/Event/Chat/Save.vue' ),
          // },
        ]
      },
      {
        path: 'accent',
        name: 'Accent',
        component: () => import( '@/views/Event/Accent.vue' )
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: {
      name: 'Error',
      query: { type: 'Request failed with status code 404' }
    }
  }
]
