<script>
import { mapGetters } from 'vuex'
import Announcement from './Announcement.vue'

export default {

  name: 'Announcements',
  
  components: {
    Announcement
  },

  computed: {

    ...mapGetters( 'announcements', [ 
      'announcements_array' ,
    ]),

  },

}
</script>

<template>
  <div :id="$id()">
    <Announcement 
      v-for="announcement in announcements_array"
      :key="announcement.id"
      :announcement="announcement"
    />
  </div>
</template>

<style scoped>

#announcements {
  position: absolute;
  top: 2rem;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
}

</style>
