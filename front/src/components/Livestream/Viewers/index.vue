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
      'viewers_array' ,
    ]),

  },

}
</script>

<template>
  <div :id="$id()">
    <Viewer 
      v-for="viewer in viewers_array"
      :key="viewer.uuid"
      :viewer="viewer"
    />
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

</style>
