<script>

import { mapGetters } from 'vuex'
import Viewer from './Viewer.vue'


// Viewers, even unregistered ones show up as the Hmm dots
// in the page header

export default {

  name: 'Viewers',

  components: {
    Viewer
  },

  computed: {
    ...mapGetters( 'viewers', [
      'connected_viewers',
      'viewers_array',
    ]),
    is_free() { 
      return this.$store.getters[ 'events/release_dots' ] 
    },
    event() {
      return this.$store.getters[ 'events/get_event' ](
        this.$route.params.slug
      )
    },
    viewers() {
      if ( this.event?.is_in_past ) {
        return this.viewers_array
      } else if ( this.connected_viewers.length ) {
        return this.connected_viewers
      } else {
        return []
      }
    }
  },

}
</script>


<template>
  <transition-group
    tag="sectiion"
    :id="$id()"
    :class="{ is_free }"
    :aria-label="`Area with dots representing the number of connected viewers. Currently: ${ connected_viewers.length  }`"
    name="dot"
  >
    <Viewer
      v-for="viewer in viewers"
      :key="viewer.uuid"
      :viewer="viewer"
    />
  </transition-group>
</template>


<style scoped>

#viewers {
  top             : var(--marquee-height);
  left            : 0;
  position        : fixed;
  width           : 100%;
  height          : 100%;
  max-height      : calc( var(--header-height) - 2 * var(--marquee-height));
  padding         : 0.5rem;
  display         : flex;
  align-items     : flex-start;
  justify-content : flex-start;
  align-content   : flex-start;
  flex-wrap       : wrap;
  z-index         : 1;
}

#viewers.is_free {
  max-height: 0%;
  overflow: visible;
  /* pointer-events: none; */
}

.mobile #viewers {
  padding         : 0rem;
}

</style>
