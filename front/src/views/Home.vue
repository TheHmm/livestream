<script>

import store     from '@/store'
import _throw    from '@/utils/throw'
import EventList from '../components/Event/List.vue'

export default {

  name: 'HomePage',

  components: {
    EventList
  },

  async setup() {
    try {
      const res = await store.dispatch( 'events/get_events' )
      return { res }
    } catch ( error ) {
      _throw( error )
      throw error
    }
  },

  computed: {

    year() {
      return this.$route.query.year
    },

    events() {
      return store
      .getters[ 'events/get_events' ]
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
