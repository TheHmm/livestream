<script>

import { mapGetters } from 'vuex'
import { defineAsyncComponent } from "vue"
import Banner from '../Header/Banner.vue'
import Marquee from './Marquee.vue'
import Info from './Info.vue'
import Options from './Options/index.vue'
import Viewers from './Viewers/index.vue'
import Chat from './Chat/index.vue'

export default {

  name: 'Livestream',

  props: {
    event: { type: Object },
  },

  components: {
    Player: defineAsyncComponent(() => import('./Player.vue')),
    Marquee,
    Banner,
    Info,
    Options,
    Viewers,
    Chat,
    // Announcements,
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
    <Viewers />
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
    <Options />
    <Chat />
  </footer>

</template>   

<style scoped>


header {
  position: relative;
  max-height: 20%;
  min-height: 20%;
  /* flex-grow: 2; */
  overflow: hidden;
}

#middle {
  box-sizing: border-box;
  --back: var(--accent);
  --fore: var(--white);
  width: 100%;
  background-color: var(--back);
  box-shadow: var(--shadow-up);
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 30%;
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  justify-content: stretch;
  padding-bottom: 4.5rem;
  transition: background-color var(--very-slow) ease;
}

#middle #status {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  border: 1px dashed var(--fore);
}

footer {
  --back: var(--accent);
  position: fixed;
  bottom: 0;
  background-color: var(--back);
  flex-grow: 0;
  max-height: 3rem;
  /* overflow: hidden; */
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
