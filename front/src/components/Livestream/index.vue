<script>

import { mapGetters } from 'vuex'
import { defineAsyncComponent } from "vue"
import Banner from '../Header/Banner.vue'
import Marquee from './Marquee.vue'
import Info from './Info.vue'
import Options from './Options.vue'

export default {

  name: 'Livestream',

  props: {
    event: { type: Object },
  },

  components: {
    Marquee,
    Banner,
    // Announcements,
    Info,
    Player: defineAsyncComponent(() => import('./Player.vue')),
    Options,
    // Chat,
  },

  data() {
    return {
    }
  },

  computed: {

    // marquee text

    marquee() { return this.event.marquee },

    // Most important property is the livestream. The livestream 
    // object is attached to the event in the api scripts. It can 
    // return a static object or refer to the livestream entry in 
    // the store. Please refer to: @/api/events/sanitize

    livestream()  { return this.event.livestream() },
    playback_id() { return this.livestream.playbackId },
    status()      { return this.livestream.status },
    active()      { return this.status == 'active' },


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

  <!-- <pre> {{ livestream }} </pre> --> 
  
  <main 
    :id="$id()"
    aria-labelledby="event_title"
  >


      <header 
        aria-label="banner & announcements"
      >
        <Marquee 
          :animate="!active"
          :marquee="marquee"
        />
        <Banner />
        <!-- <Dots /> -->
        <!-- <Announcements /> -->
      </header>

      <section 
        id="middle"
        aria-label="event information & livestream player"
      >
        <Info
          :event="event"
          :status="status"
        />
        <Player
          v-if="playback_id && active"
          :livestream="livestream"
          :mode="current_mode"
        />
      </section>

     
      <footer 
        aria-label="options & chat"
      >
        <!-- <Donate /> -->
         <Options 
          :modes="modes"
        />
        <!-- <Chat /> -->
      </footer>

  </main>


</template>   

<style scoped>

main {
  --side-width: 25%;
  box-sizing: border-box;
  height: 100%; width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

main header {
  position: relative;
  max-height: 20%;
  overflow: hidden;
}

main #middle {
  --back: var(--accent);
  --fore: var(--white);
  background: var(--back);
  box-shadow: var(--shadow-up);
  flex-grow: 1;
  display: flex;
  flex-direction: row-reverse;
  overflow: hidden;
}

.mobile main {
  justify-content: flex-start;
  position: relative;
  min-width: 100%;
  flex-direction: column;
}
.mobile #middlse {
  position: relative;
  min-width: 100%;
  
  height: auto;
  min-height: unset;
  overflow: visible;
}
</style>
