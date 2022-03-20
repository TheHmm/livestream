<script>

import Livestream from '@/components/Livestream/index.vue'

export default {

  name: 'EventPage',

  components: {
    Livestream,
  },

  computed: {

    

    // Getting the event from the route slug

    event() { 
      return this.$store.getters['events/get_event']( 
        this.$route.params.slug 
      ) 
    },

    // event-specific marquee

    accent()  { return this.event.accent },  
    
  },

  created() {

  }
}
</script>

<template>

  <main 
    :id="$id()"
    :style="{ '--accent': accent }"
    aria-labelledby="event_title"
  >

    <Livestream 
      :event="event"
    />

  </main>

</template>

<style scoped>

main {
  --side-width: 25rem;
  --side-max-width: 25%;
  box-sizing: border-box;
  height: 100vh; width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  /* overflow: hidden; */
}

main.mobile {
  --side-width: 100%;
  --side-max-width: 100%;
}

</style>
