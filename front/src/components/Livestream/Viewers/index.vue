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
    ]),
  },

}
</script>

<template>
  <div :id="$id()">
    <transition-group name="dot" mode="out-in">
      <Viewer 
        v-for="viewer in connected_viewers"
        :key="viewer.uuid"
        :viewer="viewer"
      />
    </transition-group>
  </div>
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
}


</style>
