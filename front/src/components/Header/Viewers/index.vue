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
  <!-- <section
  > -->
    <transition-group
      tag="sectiion"
      :id="$id()"
    :aria-label="`Area with dots representing the number of connected viewers. Currently: ${ connected_viewers.length  }`"

      name="dot">
      <Viewer
        v-for="viewer in viewers"
        :key="viewer.uuid"
        :viewer="viewer"
      />
    </transition-group>
  <!-- </section> -->
</template>


<style scoped>

#viewers {
  top             : var(--marquee-height);
  position        : absolute;
  width           : 100%;
  height          : 100%;
  padding         : 0.5rem;
  display         : flex;
  align-items     : flex-start;
  justify-content : flex-start;
  align-content   : flex-start;
  flex-wrap       : wrap;
  z-index         : 1;
}

.mobile #viewers {
  padding         : 0rem;
}

</style>
