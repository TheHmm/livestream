<script>

// The Event view. This view wraps the child route component.
// This could be the livestream component or chat component.
// It also creates base styles to work from and handles
// connection to the socket server.

// import Announcements from '@/components/Header/Announcements/index.vue'
import _throw           from '@/router/throw'


export default {

  name : 'EventPage',

  components : {
    // Announcements,
  },


  // We get our event object frmm the route slug. Note that
  // the event has already been fetched in the before_enter
  // route guard: @/router/guards/before_enter_event

  computed: {
    event() {
      return this.$store.getters[ 'events/get_event' ](
        this
        .$route
        .params
        .slug
      )
    },
    accent() {
      return this.event?.accent
    },
    hide_input() {
      return this.$route.query.hide_input
    }
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

  async created() {
    this.$socket.client.connect()
    const slug = this.$route.params.slug
    const { dispatch } = this.$store
    try {
      await dispatch( 'livestream/get_livestream' )
      const { id } = await dispatch( 'events/get_event', slug )
      await dispatch( 'viewers/get_viewers', id )
      await dispatch( 'messages/get_messages', id )
      await dispatch( 'announcements/get_announcements', id )
    } catch ( error ) {
      this.$router.push( _throw( error ) )
    }
  },


  // For the same reason, we disconnect from the socket
  // server before we leave this route.

  beforeUnmount() {
    this.$socket.client.disconnect()
    const { commit } = this.$store
    commit( 'messages/SET_MESSAGES', {} )
    commit( 'viewers/SET_VIEWERS', {} )
    commit( 'announcements/SET_ANNOUNCEMENTS', {} )
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
  },


}
</script>

<template>
    <section
      :class="[ 'event' ]"
      :style="{ ...accent }"
    >
      <!-- { hide_input } -->
    <!-- aria-labelledby="event_title" -->
      <!-- aria-label="event information, livestream player & chat" -->
      <router-view
          v-if="event"
          v-slot="{ Component }"
      >
        <component
          :is="Component"
          :event="event"
        />
      </router-view>
    <!-- <Announcements /> -->
    </section>
</template>

<style scoped>

.event {
  flex-direction   : row-reverse;
  height           : 100%;
  /* animation        : enterMiddle var(--enter) ease 0.1s forwards !important; */
  padding-bottom   : var(--footer-height) !important;
}

/* @keyframes enterMiddle {
  from { transform : translateY(100%) }
  to   { transform : translateY(0) }
} */

</style>
