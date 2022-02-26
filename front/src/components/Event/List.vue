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
  <main>
    <h2>Livestreams</h2>
    <ul>
      <Event
        v-for="event in events"
        :key="event.slug"
        :event="event"
      />
    </ul>
  </main>
</template>
