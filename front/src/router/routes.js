export default [


  // Defining our routes; note the route for '/:slug' :
  // it is meant to route to events based on their slug,
  // which are created in and fetched from Strapi.

  // desired_tabs: the names of the footer tabs that this
  // route displays.

  {
    path: '/',
    name: 'Agenda',
    component: () => import( '@/views/Agenda.vue' ),
    meta: {
      desired_tabs : [
        'access',
      ]
    },
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import( '@/views/Archive.vue' ),
    meta: {
      desired_tabs : [
        'access',
      ]
    },
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import( '@/views/Fallback.vue' )
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
            'access',
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
            'access',
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
        path: 'placeholder',
        name: 'Placeholder',
        component: () => import( '@/components/Utils/Placeholder.vue' ),
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
