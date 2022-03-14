<script>

import { defineAsyncComponent } from "vue"
import { mapGetters } from 'vuex'

export default {

  name: 'Livestream',

  props: {
    livestream: {
      type: Object
    }
  },

  components: {
    Player        : defineAsyncComponent(() => import('./Player.vue')),
    // Chat          : defineAsyncComponent(() => import('./Chat.vue')),
    // Announcements : defineAsyncComponent(() => import('./Announcements.vue')),
  },

  data() {
    return {
    }
  },

  computed: {

    // We get the list of available streaming modes from the store
    // this list can be updated by HLS.js at any moment.

    ...mapGetters( 'livestream', [ 
      'modes' ,
      'default_mode',
    ]),

    current_mode() {
      return (
        this.$route.query?.mode && 
        this.modes[this.$route.query.mode] || 
        this.default_mode
      )
    }
    
  },

}
</script>
  
<template>

  <section 
    :id="$id()"
    aria-label="livestream"
  >


      <div 
        id="options"
        aria-label="livestream options"
      >
        <span> modes: </span>
        <ul id="modes">
          <li 
            v-for="mode in modes"
            :key="mode.name"
            :value="mode.label"
          >
            <router-link 
              :to="{
                name: $route.name,
                query: { mode: mode.name }
              }"
            >
              {{ mode.label }}
            </router-link>
          </li>
        </ul>
      </div>

      <div 
        id="videoContainer"
        aria-label="livestream player"
      >
        <Player 
          :livestream="livestream"
          :mode="current_mode"
        />
      </div>

      <!-- <Announcements /> -->

      <!-- <Chat /> -->

  </section>

</template>

<script>

</script>

<style scoped>

#livestream {
  height: 100%; width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  overflow: hidden;
}

main {
  box-sizing: border-box;
  width: 100%; height: 100%;
  min-height: 0;
  /* display: flex; */
  justify-content: stretch;
  align-items: stretch;
  overflow: hidden;
}
main #options {
  display: flex;
}
main #options ul#modes {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}
main #options ul#modes li {
  margin-left: 0.5rem;
}




#videoContainer {
  /* position: absolute; */
  width: 100%; height: 100%;
  top: 0;
  min-height: 0;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  flex-direction: column;
  overflow: hidden;
}

.mobile #livestream {
  justify-content: flex-start;
}
.mobile main {
  position: relative;
  min-width: 100%;
  flex-direction: column;
}
.mobile #videoContainer {
  position: relative;
  min-width: 100%;
  height: auto;
  min-height: unset;
  overflow: visible;
}
</style>
