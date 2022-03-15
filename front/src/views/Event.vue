<script>

import { mapGetters } from 'vuex'
import Livestream from '@/components/Livestream/index.vue'

export default {

  name: 'EventPage',

  components: {
    Livestream,
  },

  computed: {

    // Getting the event from the route slug

    ...mapGetters( 'events', [ 'get_event' ] ),
    event() { return this.get_event( this.$route.params.slug ) },
    
  },

  created() {

  }
}
</script>

<template>

  <Livestream 
    :event="event"
  />

</template>

<style scoped>
</style>
