<script>
import store     from '@/store'
import _throw    from '@/utils/throw'
import AgendaList from '../components/Event/AgendaList.vue'
export default {
  name: 'Agenda',
  components: { AgendaList },
  async setup() {
    try {
      await store.dispatch( 'events/get_future_events' )
    } catch ( error ) {
      _throw( error )
      throw error
    }
  },
  computed: {
    events() {
      return store.getters[ 'events/get_future_events' ]
    }
  },
}
</script>
<template>
  <AgendaList
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
