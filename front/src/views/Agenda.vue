<script>


// Event archive page. Async component, loads passt events list
// in setup.

import store     from '@/store'
import _throw    from '@/utils/throw'
import EventList from '../components/Event/List.vue'

export default {

  name: 'Agenda',

  components: { EventList },

  async setup() {
    try {
      const res = await store.dispatch( 'events/get_future_events' )
      return { res }
    } catch ( error ) {
      _throw( error )
      throw error
    }
  },

  // Get events, filter by year, sort reverse-chrono.

  computed: {
    events() {
      return store.getters[ 'events/get_future_events' ]
    }
  },

}

</script>


<template>
  <EventList
    v-if="events.length"
    :events="events"
  />
  <p class="fallback" v-else>
    No future events planned.
  </p>
</template>


<style scoped>
p.fallback {
  margin: 1rem;
}
</style>
