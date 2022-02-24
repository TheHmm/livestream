<script>
import { mapGetters } from 'vuex'


export default {

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
      <ul>
        <!-- {{ events }} -->
        <router-link 
          v-for="event in events"
          :key="event.slug"
          :to="event.slug"
        >
          {{ event.title }}
        </router-link>
      </ul>
  </main>
</template>
