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

  methods: {
    key( viewer ) {
      console.log(+viewer.uuid[viewer.uuid.length-1])
      return +viewer.uuid[viewer.uuid.length-1]
    }
  }

}
</script>

<template>
  <div :id="$id()">
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
}


.viewer.dot-enter-active,
.viewer.dot-leave-active {
  transition: all var(--slow) ease;
}
.viewer.dot-enter-from,
.viewer.dot-leave-to {
  background-color: red;
  /* animation: dot_enter var(--slow) ease  forwards; */
}



@keyframes dot_enter {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

</style>
