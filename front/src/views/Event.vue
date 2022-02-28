<script >
import { mapGetters } from 'vuex'
import Livestream from '../components/Event/Livestream.vue'
export default {

  name: 'EventPage',

  components: {
    Livestream
  },

  computed: {
    ...mapGetters('events',[
      'get_event'
    ]),
    event() { return this.get_event(this.$route.params.slug ) },
    title() { return this.event.title },
    slug()  { return this.event.slug },
    in_past() { return this.event.is.in_past() },
    in_future() { return this.event.is.in_future() },
    soon() { return this.event.is.soon() }
    
  },

  created() {

  }
}
</script>

<template>

  <main :class="$id()">

    <h2>{{ event.title }}</h2>

    <div 
      v-if="!event" 
      class="loading"
    >
      loading...
    </div>

    <div
      v-else-if="in_future && !soon"
      class="in_future"
    >
      <p> This event is planned for the future.</p>
      <pre>{{ event }}</pre>
    </div>

    <div v-else>
      <Livestream 
        :event="event"
      />
    </div>
  </main>
  
</template>

<style scoped >

.in_future pre {
  opacity: 0.2;
}

</style>
