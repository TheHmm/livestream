<script>

import { mapGetters } from 'vuex'
import Viewer from './Viewer.vue'

export default {

  name: 'Viewers',
  
  components: {
    Viewer
  },

  computed: {
    ...mapGetters( 'viewers', [ 
      'connected_viewers' ,
    ]),
  },

}
</script>

<template>
  <div 
    :id="$id()"
  >
    <transition-group name="dot" mode="in-out">
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
  position: absolute;
  top: 2rem;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
}


.dot-enter-from,
.dot-leave-to {
  transform: scale(0);
}

</style>
