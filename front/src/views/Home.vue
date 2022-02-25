<script>
import { mapGetters } from 'vuex'
import EventList from '../components/Event/List.vue'

export default {

  name: 'Home',

  components: {
    EventList
  },

  computed: {
  },

}
</script>

<template>
  <EventList />
</template>
