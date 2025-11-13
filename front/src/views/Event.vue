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
      const { documentId } = await dispatch( 'events/get_event', slug )
      await dispatch( 'livestream/get_livestream_by_event', documentId )
      await dispatch( 'viewers/get_viewers', documentId )
      await dispatch( 'messages/get_messages', documentId )
      await dispatch( 'announcements/get_announcements', documentId )
      return { documentId }
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


  // We only need to connect to our event-room when we
  // enter the event page.

  created() {
    if ( !this.is_in_past ) {
      this.$socket.client.emit('join_room', this.event.slug )
    }
  },


  // For the same reason, we disconnect from the socket
  // server before we leave this route.

  beforeUnmount() {
    if ( !this.is_in_past ) {
      this.$socket.client.emit('leave_room')
    }
    const { commit } = this.$store
    commit( 'messages/SET_MESSAGES', {} )
    commit( 'viewers/SET_VIEWERS', {} )
    commit( 'announcements/SET_ANNOUNCEMENTS', {} )
    commit( 'livestream/SET_CC', [] )
  }


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
  flex-direction   : row;
  height           : 100%;
  /* animation        : enterMiddle var(--enter) ease 0.1s forwards !important; */
  padding-bottom   : var(--footer-height);
}

.mobile .event {
  flex-direction: column-reverse;
}

#savepage .event,
#chatpage .event {
  padding: 0;
  padding-bottom: 0;
}

#savepage .event {
  height: unset;
  display: unset;
}

#playerpage .event {
  padding-bottom: var(--size-s);
  background: black !important;
}

</style>
