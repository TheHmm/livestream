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

    

    // Event-specific marquee

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
  
  

  <Marquee 
    :animate="!active"
    :marquee="marquee"
  />

  <header 
    aria-label="banner & announcements"
  >
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
    <div 
      v-else
      id="status"
      aria-label="livestream status"
    >
      <p role="status">{{ status }}</p>
    </div>
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

</template>   

<style scoped>


header {
  position: relative;
  max-height: 20%;
  min-height: 10%;
  /* flex-grow: 1; */
  overflow: hidden;
}

#middle {
  box-sizing: border-box;
  --back: var(--accent);
  --fore: var(--white);
  width: 100%;
  background: var(--back);
  box-shadow: var(--shadow-up);
  flex-grow: 1;
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  /* justify-content: flex-start; */
  padding-bottom: 4rem;
}

#middle #status {
  box-sizing: border-box;
  width: 100%;
  /* height: 100%; */
  text-align: center;
  display: flex;
  margin: 1rem;
  border: 1px dashed var(--fore);
}
#middle #status p {
  margin: 30% auto;
}


footer {
  --back: var(--accent);
  background-color: var(--back);
  flex-grow: 0;
  max-height: 3rem;
  overflow: visible;
}

.mobile #middle {
  flex-direction: column-reverse;
  /* position: relative;
  min-width: 100%;
  
  height: auto;
  min-height: unset;
  overflow: visible; */
}
</style>
