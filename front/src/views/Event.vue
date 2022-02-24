<script >
import { mapGetters } from 'vuex'
export default {

  computed: {
    ...mapGetters('events',[
      'get_event'
    ]),
    event() { 
      return this.get_event(this.$route.params.slug )
    }
  },

  created() {

  }
}
</script>

<template>

  <main v-if="event">
      event page: {{ event }}
  </main>
  
</template>
