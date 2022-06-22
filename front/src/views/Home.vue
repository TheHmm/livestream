<script>

import { mapGetters } from 'vuex'
import _throw    from '@/router/throw'
import EventList from '../components/Event/List.vue'

export default {
  name: 'HomePage',

  components: {
    EventList
  },

  async created() {
    try {
      await this.$store.dispatch( 'events/get_events' )
    } catch ( error ) {
      this.$router.push( _throw( error ) )
    }
  },

  computed: {

    year() {
      return this.$route.query.year
    },

    ...mapGetters('events', [
      'get_events'
    ]),

    events() {
      return this
      .get_events
      .filter( e => {
        if ( this.year ) {
          return (
            this.$time.get_year( e.starts ) ==
            this.$time.get_year( this.year )
          )
        } else {
          return true
        }
      })
    }
  },

}

</script>

  <!-- aria-label="Event archive" -->

<template>
  <EventList
    v-if="events.length || !year"
    :events="events"
  />
  <p class="fallback" v-else>
    No events found for year {{ year }}.
  </p>
</template>


<style scoped>
p.fallback {
  margin: 1rem;
}
</style>
