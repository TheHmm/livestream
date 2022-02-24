<script>
import { mapGetters } from 'vuex'

export default {

  name: 'Home',

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
      <li
        v-for="event in events"
        :key="event.slug"
      >
        <router-link 
          :to="event.slug"
        >
          {{ event.title }}
        </router-link>
      </li>
    </ul>
  </main>
</template>
