<script >
import { mapGetters } from 'vuex'
import Livestream from '../components/Event/Livestream.vue'
export default {

  name: 'EventPage',

  components: {
    Livestream
  },

  computed: {

    // Basic event properties.

    ...mapGetters( 'events', [ 'get_event' ] ),
    event()     { return this.get_event( this.$route.params.slug ) },
    title()     { return this.event.title },
    slug()      { return this.event.slug },

    // Time-related event properties

    in_past()   { return this.event.is.in_past() },
    in_future() { return this.event.is.in_future() },
    soon()      { return this.event.is.soon() },
    starts()    { return this.event.starts },
    ends()      { return this.event.ends },

    // Most important property is the livestream. The livestream 
    // object is attached to the event in the api scripts. It can 
    // return a static object or refer to the livestream entry in 
    // the store. Please refer to: @/api/events/sanitize

    livestream()  { return this.event.livestream() },
    playback_id() { return this.livestream.playbackId },
    active()      { return this.livestream.status == 'active' },


    // We get the list of available streaming modes from the store
    // this list can be updated by HLS.js at any moment.

    ...mapGetters( 'livestream', [ 
      'modes' ,
      'default_mode',
    ]),

    current_mode() {
      return (
        this.$route.query?.mode && 
        this.modes[this.$route.query.mode] || 
        this.default_mode
      )
    }
    
  },

  created() {

  }
}
</script>

<template>

  <section 
    v-if="!event" 
    role="status"
    class="loading"
  >
      loading...
  </section>

  <main 
    v-else
    aria-labelledby="event_title"
    :class="$id()"
  >

    <h2 id="event_title">{{ event.title }}</h2>

    <section 
      aria-label="event information"
    >
      <p aria-label="event summary">
        {{ event.info }}
      </p>
    </section>
    
    <!-- <pre> {{ livestream }} </pre> -->

    <Livestream 
      v-if="playback_id && active"
      :livestream="livestream"
    />

    <section
      v-else
      aria-label="event status"
    >
      <p v-if="event.is.soon()">The livestream starts <time>{{ starts }}</time>.</p>
      <p v-else>The livestream is over. The recording will be available here shortly.</p>
    </section>

  </main>
</template>

<style scoped >

.in_future pre {
  opacity: 0.2;
}

</style>
