<script>


// Event archive page. Async component, loads passt events list
// in setup.

import store     from '@/store'
import _throw    from '@/utils/throw'
import EventList from '../components/Event/List.vue'

export default {

  name: 'Archive',

  components: { EventList },

  async setup() {
    try {
      const res = await store.dispatch( 'events/get_past_events' )
      return { res }
    } catch ( error ) {
      _throw( error )
      throw error
    }
  },

  computed: {


    // Filter events by year.

    year() {
      return this.$route.query.year
    },


    // Get events, filter by year, sort reverse-chrono.

    events() {
      return store
      .getters[ 'events/get_past_events' ]
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
