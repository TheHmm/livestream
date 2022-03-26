<script>
import { mapGetters } from 'vuex'
import Announcement   from './Announcement.vue'


// Container for announcements received froms Strapi. 

export default {

  name: 'Announcements',
  
  components: {
    Announcement
  },

  computed: {
    ...mapGetters( 'announcements', [ 
      'most_recent'
    ]),
  },

}
</script>


<template>
  <div :id="$id()">
    <transition name="fall-in" >
      <Announcement 
        v-if="most_recent"
        :announcement="most_recent"
      />
    </transition>
  </div>
</template>


<style scoped>

#announcements {
  position   : absolute;
  top        : var(--marquee-height);
  height     : var(--header-height);
  width      : 0;
  overflow   : visible;
  font-size  : 1.33rem;
  transform  : translateY( calc( var(--header-height) * -1 ) );
  animation  : enter var(--enter) ease 0.75s forwards;
  transition : transform 0.5s ease;
}

.fall-in-move, 
.fall-in-enter-active,
.fall-in-leave-active {
  transition : transform 0.5s ease;
}
.fall-in-enter-from,
.fall-in-leave-to {
  transform  : translateY( calc( var(--header-height) * -1 ) );
}
.fall-in-leave-active {
  position   : absolute;
}

@keyframes enter {
  from { transform: translateY( calc( var(--header-height) * -1 ) ) }
  to   { transform: translateY( 0 ) }
}

</style>
