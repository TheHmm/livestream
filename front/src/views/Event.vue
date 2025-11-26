<script>

// The Event view. This view wraps the child route component.
// This could be the livestream component or chat component.
// It also creates base styles to work from and handles
// connection to the socket server.

import { useRoute }  from 'vue-router'
import store         from '@/store'
import _throw        from '@/utils/throw'
import Announcements from '@/components/Utils/Announcements/index.vue'
import { mapGetters } from 'vuex/dist/vuex.cjs.js'

export default {

  name : 'EventPage',

  components : {
    Announcements,
  },

  data() {
    return {
      password: null,
      error_message: null,
    }
  },

  computed: {
    ...mapGetters( 'viewers', [
      'view_authenticated'
    ]),
    event() {
      return this.$store.getters[ 'events/get_event' ](
        this.$route.params.slug
      )
    },
    is_in_past() {
      return this.event?.is_in_past
    },
  },


  // we first fetch the event data, initentionally leaving
  // out the password. Strapi is configured to handle this 
  // by sending us back the event data without the protected
  // fields. We then check to see if the event is password
  // protected and conditionally move on with authenticated
  // setup.

  async setup() {
    const slug = useRoute().params.slug
    try {
      let event = await store.dispatch( 'events/get_event', { slug })
      if ( !event.password_protected ) {
        await this.authenticated_setup()
      }
    } catch ( error ) {
      _throw( error )
      throw error
    }
  },

  mounted() {
    if ( !this.view_authenticated ) {
      this.$refs.password.focus()
    }
  },  


  // For the same reason, we disconnect from the socket
  // server before we leave this route.

  beforeUnmount() {
    this.destroy()
  },

  methods: {

    async fetch_with_password() {
      if ( !this.password ) {
        this.error_message = "Please provide an event access code."
        return
      }
      this.error_message = null
      try {
        await this.$store.dispatch( 'events/get_event', { 
          slug: this.$route.params.slug,
          password: this.password
        })
        await this.authenticated_setup()
      } catch ( error ) {
        this.password = null
        this.error_message = 'Error: Incorrect access code.' + '\n' + error.message
        console.error( error )
      }
    },
    
    async authenticated_setup() {
      const { dispatch, commit } = this.$store
      const { documentId } = this.event
      commit( 'viewers/SET_VIEW_AUTHENTICATED', true )
      await dispatch( 'livestream/get_livestream_by_event', documentId )
      await dispatch( 'viewers/get_viewers', documentId )
      await dispatch( 'messages/get_messages', documentId )
      await dispatch( 'announcements/get_announcements', documentId )
      if ( !this.is_in_past ) {
        this.$socket.client.emit( 'join_room', this.event.slug )
      }
    },

    destroy() {
      if ( !this.is_in_past ) {
        this.$socket.client.emit( 'leave_room' )
      }
      const { commit } = this.$store
      commit( 'messages/SET_MESSAGES', {} )
      commit( 'viewers/SET_VIEWERS', {} )
      commit( 'viewers/SET_VIEW_AUTHENTICATED', false )
      commit( 'announcements/SET_ANNOUNCEMENTS', {} )
      commit( 'livestream/SET_CC', [] )
    }

  }


}
</script>

<template>
  <section
    class="event"
    aria-labelledby="event_title"
  >
    <form 
      id="access_form"
      v-if="!view_authenticated"  
    >
      <router-link
        custom
        :to="{ path: is_in_past ? '/archive' : '/', query: $route.query }"
        v-slot="{ navigate }"
      >
        <input
          value="✕"
          class="close circle"
          name="close"
          type="button"
          @click.stop="navigate"
        />
      </router-link>
      <p><label>Please enter event access code: </label></p>
      <input 
        type="password" 
        ref="password"
        v-model="password"  
        required
      />
      <input 
        type="submit" 
        value="submit" 
        @click.prevent="fetch_with_password"  
      />
      <div
        v-if="error_message" 
        class="error"
        v-html="$md( error_message )"
      ></div>
    </form>
    <router-view
      v-if="view_authenticated && event"
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
