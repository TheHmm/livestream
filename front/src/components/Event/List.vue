<script>
import { mapGetters } from 'vuex'
import Event from './Event.vue'

export default {
  
  name: 'EventList',

  components: { 
    Event,
  },

  computed: {
    ...mapGetters('events', [
      'get_events'
    ]),
    events() { 
      return this.get_events
    }
  },

}
</script>

<template>
  <main
    aria-labelledby="past_streams_title"
  >
    <h2 id="past_streams_title" >Past streams</h2>
    <ul
      aria-labelledby="past_streams_title"
    >
      <Event
        v-for="event in events"
        :key="event.slug"
        :event="event"
      />
    </ul>
  </main>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  /* display: flex; */
  /* flex-wrap: wrap; */
}
</style>
