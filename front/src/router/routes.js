export default [


  // Defining our routes; note the route for '/:slug' :
  // it is meant to route to events based on their slug,
  // which are created in and fetched from Strapi.

  // desired_tabs: the names of the footer tabs that this
  // route displays.

  {
    path: '/',
    name: 'Home',
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
    component: () => import( '@/views/Event.vue' ),
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
        path: 'player',
        name: 'PlayerPage',
        component: () => import( '@/components/Livestream/Player/index.vue' ),
        meta: {
          hide_header: true
        }
      },
      {
        path: 'captions',
        name: 'CaptionsPage',
        redirect: {
          name: 'PlayerPage',
          query: { mode: 'transcript' }
        }
      },
      {
        path: 'chat',
        name: 'ChatPage',
        component: () => import( '@/components/Chat/index.vue' ),
        meta: {
          desired_tabs : [
            'about',
            'access',
            'donate',
            'emoji',
          ]
        },
      },
      {
        path: 'chat/save',
        name: 'SavePage',
        component: () => import( '@/components/Chat/save.vue' ),
        meta: {
          hide_header: true,
          desired_tabs: []
        }
      },
      {
        path: 'accent',
        name: 'Accent',
        component: () => import( '@/components/Utils/Accent.vue' )
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
