<script>

import { mapGetters } from 'vuex'
import { defineAsyncComponent } from "vue"
import Banner from '../Header/Banner.vue'
import Marquee from '../Header/Marquee.vue'
import Info from './Info.vue'
import Options from './Options/index.vue'
import Viewers from './Viewers/index.vue'
import Chat from './Chat/index.vue'
import Network from '../Header/Network.vue'

export default {

  name: 'Livestream',

  props: {
    event: { type: Object },
  },

  components: {
    Player: defineAsyncComponent(() => import('./Player/index.vue')),
    Marquee,
    Banner,
    Info,
    Options,
    Viewers,
    Chat,
    Network,
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

  <!-- <pre> {{ livestream }} </pre>  -->
  
  


  <header aria-label="banner & announcements">
    <Marquee 
      :marquee="marquee"
      :animate="!active"
    />
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
  
  <footer aria-label="options & chat">
    <Options />
    <Network />
    <Chat />
  </footer>

</template>   

<style scoped>


header {
  position: relative;
  max-height: 20%;
  /* overflow: visible; */
}

header .marquee {
  height: 2rem;
}

#middle {
  --back: var(--accent);
  --fore: var(--white);
  background-color: var(--back);
  box-shadow: var(--shadow-up);
  box-sizing: border-box;
  width: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 30%;
  padding: 1rem;
  padding-bottom: calc( var(--footer-height) + 1rem );
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  justify-content: stretch;
  transition: background-color var(--very-slow) ease;
  z-index: 0;
  transform: translateY(10rem);
  animation: enter var(--enter) ease 0.1s forwards;
}

@keyframes enter {
  from { transform: translateY(10rem) }
  to { transform: translateY(0) }
}

#middle #status {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--fore);
}

#middle #info {
  flex-shrink: 0;
  margin-left: 1rem;
}

footer {
  --back: var(--accent);
  /* background-color: var(--back); */
  position: fixed;
  box-sizing: border-box;
  bottom: 0;
  flex-grow: 0;
  width: 100%;
  height: 100%;
  max-height: var(--footer-height);
  padding: 0 1rem;
  display: flex;
  align-items: flex-end;
}

footer #options {
}

footer #network {
  margin: 0.2rem 1rem;
  margin-right: auto; 
}

footer #chat_container {
  margin-left: 1rem;
  width: calc(var(--side-width));
}



.mobile #middle {
  flex-direction: column-reverse;
  align-items: stretch;
  /* padding-bottom: unset; */
}
.mobile #middle #status {
  width: unset;
  max-height: 30%;
}

.mobile footer {
  max-height: 6rem;
  flex-direction: row-reverse;
}

.mobile footer {
  /* flex-wrap: wrap; */
  flex-direction: column-reverse;
}
</style>
