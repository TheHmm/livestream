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

  <main>
    <h2>{{ event.title }}</h2>
    <pre>{{ event }}</pre>
  </main>
  
</template>
