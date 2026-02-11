<script>
import _throw    from '@/utils/throw'
import AgendaList from '../components/Event/AgendaList.vue'
export default {
  name: 'Agenda',
  components: { AgendaList },
  async created() {
    try {
      await this.$store.dispatch( 'events/get_future_events' )
      if (!this.events.length) {
        this.loading_message = 'There are no upcoming events.'
      }
    } catch ( error ) {
      _throw( error )
      throw error
      this.loading_message = `Error fetching events. ${ error.message }`
    }
  },
  data() {
    return {
      loading_message: 'Fetching agenda...'
    }
  },
  computed: {
    events() {
      return this.$store.getters[ 'events/get_future_events' ]
    }
  },
}
</script>
<template>
  <AgendaList
    v-if="events.length"
    :events="events"
  />
  <section class="loader" v-else>
    {{ loading_message }}
  </section>
</template>
<style scoped>
</style>
