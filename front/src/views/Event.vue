<script>

import Livestream from '@/components/Livestream/index.vue'
import Banner from '../components/Header/Banner.vue'


export default {

  name: 'EventPage',

  components: {
    Livestream,
    Banner
  },

  computed: {

    event() { return this.$store.getters['events/current_event'] },
    accent() { return this.event.accent },  
    
  },

  created() {

  }
}
</script>

<template>
  <main 
    :id="$id()"
    :style="{ ...accent }"
    aria-labelledby="event_title"
  >
    <Livestream 
      :event="event"
    />
  </main>
</template>

<style scoped>

main {

  --accent         : hsl( var(--h), var(--s), var(--l) );
  --increment      : 9.6%;

  --dark-l         : calc( var(--l) + 1 * var(--increment) );
  --darker-l       : calc( var(--l) + 2 * var(--increment) );
  --mid-l          : calc( var(--l) + 3 * var(--increment) );
  --lighter-l      : calc( var(--l) + 4 * var(--increment) );
  --light-l        : calc( var(--l) + 5 * var(--increment) );

  --accent-dark    : hsl( var(--h), var(--s), var(--dark-l));
  --accent-darker  : hsl( var(--h), var(--s), var(--darker-l));
  --accent-mid     : hsl( var(--h), var(--s), var(--mid-l));
  --accent-lighter : hsl( var(--h), var(--s), var(--lighter-l));
  --accent-light   : hsl( var(--h), var(--s), var(--light-l));

  --footer-height: 4rem;
  --side-width: 20rem;

  --back: var(--accent-light);
  
  background-color: var(--white);

  box-sizing: border-box;
  height: 100vh; width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  animation: enter var(--very-slow) ease forwards;
}

@keyframes enter {
  from { background-color: var(--white) }
  to { background-color: var(--back) }
}

main.mobile {
  --side-width: 100%;
}

</style>
