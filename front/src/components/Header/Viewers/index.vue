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
      'visible_connected_viewers',
      'viewers_array',
    ]),
    release_dots() { return ( 
      this.$store.getters[ 'events/get_event' ]( this.$route.params.slug )
      && !this.$store.getters[ 'events/get_event' ]( this.$route.params.slug ).is_in_past
      && this.$store.getters[ 'events/get_event' ]( this.$route.params.slug ).releaseDots
      && this.$route.query[ 'reduce_motion' ] !== 'true'
      && this.connected_viewers.length <= 100
    )},
    event() {
      return this.$store.getters[ 'events/get_event' ](
        this.$route.params.slug
      )
    },
    viewers() {
      if ( this.event?.is_in_past ) {
        return this.viewers_array
      } else if ( this.visible_connected_viewers.length ) {
        return this.visible_connected_viewers
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
    :class="{ is_free: release_dots }"
    :style="{ '--dot-count': viewers.length }"
    :aria-label="`Area with dots representing the number of connected viewers. Currently: ${ visible_connected_viewers.length  }`"
    name="dot"
  >
    <Viewer
      v-for="viewer in viewers"
      :key="viewer.uuid"
      :viewer="viewer"
      :release_dots="release_dots"
    />
  </transition-group>
</template>


<style scoped>

#viewers {
  height          : 100%;
  max-height: var(--letter-height);
  overflow-y: scroll;
  display         : flex;
  flex-direction: column;
  align-items     : flex-start;
  justify-content : flex-start;
  align-content: flex-start;
  flex-wrap       : wrap;
  z-index         : 3;
  padding-block: var(--padding);
  width: 100%;
  min-width: calc( var(--dot-height) * 1.5 );
  max-width: calc( var(--dot-height) * 3 * var(--dot-count) / 7);
  transition: max-width var(--fast) linear;
}

#viewers:empty {
  min-width: 0;
}

#viewers.is_free {
  top: 0; 
  left            : 0;
  position        : fixed;
  max-height: 0%;
  overflow: visible;
  /* pointer-events: none; */
  min-width: 0 !important;
  max-width: 0 !important;
}

.mobile #viewers {
  /* padding         : 0rem; */
}

.mobile #viewers:has( .emo ) {
  min-width: calc( var(--dot-height) * 4 );
  max-width: calc( var(--dot-height) * 2 * var(--dot-count) );
}

</style>
