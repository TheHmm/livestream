<script>

// The Event view. This view wraps the child route component.
// This could be the livestream component or chat component.
// It also creates base styles to work from and handles
// connection to the socket server.

import { useRoute }  from 'vue-router'
import store         from '@/store'
import _throw        from '@/utils/throw'
import Announcements from '@/components/Utils/Announcements/index.vue'

export default {

  name : 'EventPage',

  components : {
    Announcements,
  },

  async setup() {
    const slug = useRoute().params.slug
    const { dispatch } = store
    try {
      await dispatch( 'livestream/get_livestream' )
      const { id } = await dispatch( 'events/get_event', slug )
      await dispatch( 'viewers/get_viewers', id )
      await dispatch( 'messages/get_messages', id )
      await dispatch( 'announcements/get_announcements', id )
      return { id }
    } catch ( error ) {
      _throw( error )
      throw error
    }
  },


  // We get our event object frmm the route slug. Note that
  // the event has already been fetched in the before_enter
  // route guard: @/router/guards/before_enter_event

  computed: {
    event() {
      return this.$store.getters[ 'events/get_event' ](
        this.$route.params.slug
      )
    },
    is_in_past() {
      return this.event?.is_in_past
    },
  },


  // Authenticate on load, this wayt you can send messages
  // immediately

  methods: {
    async authenticate() {
      return await this.$store.dispatch(
        'viewers/authenticate'
      )
    }
  },


  // We only need to connect to our socket server when we
  // enter the event page. In all other routes, socket
  // networking is unnecessary.

  created() {
    if ( !this.is_in_past ) {
      this.$socket.client.connect()
    }
  },


  // For the same reason, we disconnect from the socket
  // server before we leave this route.

  beforeUnmount() {
    if ( !this.is_in_past ) {
      this.$socket.client.disconnect()
    }
    const { commit } = this.$store
    commit( 'messages/SET_MESSAGES', {} )
    commit( 'viewers/SET_VIEWERS', {} )
    commit( 'announcements/SET_ANNOUNCEMENTS', {} )
    commit( 'livestream/SET_CC', [] )
  },


  // When we connect to the socket server, we need to
  // send everyone our uuid, even if the viewer hasn't
  // been stored to the database, this way, all visitors
  // can see each other and send emoji.

  sockets: {
    async connect() {
      this.$log.info( 'SOCKET', 'Connected.' )
      this.$socket.client.emit('viewer', {
        uuid: this.$store.state.viewers.uuid,
      })
      await this.authenticate()
    },
    disconnect() {
      this.$log.info( 'SOCKET', 'Disconnected.' )
    }
  },


}
</script>

<template>
  <section
    class="event"
    aria-labelledby="event_title"
  >
    <router-view
      v-if="event"
      v-slot="{ Component }"
    >
      <component
        :is="Component"
        :event="event"
      />
    </router-view>
    <Announcements />
  </section>
</template>

<style scoped>

.event {
  flex-direction   : row-reverse;
  height           : 100%;
  /* animation        : enterMiddle var(--enter) ease 0.1s forwards !important; */
  padding-bottom   : var(--footer-height);
}

#chatpage .event {
  padding: 0;
  padding-bottom: 0;
}


</style>
