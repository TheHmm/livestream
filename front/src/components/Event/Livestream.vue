<script>

// import Player from './Player.vue'
// import Chat from '../components/Chat'
// import Announcements from '../components/Announcements'
import { defineAsyncComponent } from "vue"
import { mapGetters } from 'vuex'

export default {

  name: 'Livestream',

  props: {
    event: {
      type: Object
    }
  },

  components: {
    Player: defineAsyncComponent(() => import('./Player.vue')),
    // Chat,
    // Announcements,
  },

  data() {
    return {
    }
  },

  computed: {

    // Basic event properties.

    title()       { return this.event.title },
    starts()      { return this.event.starts },
    ends()        { return this.event.ends },
    recording()   { return this.event.recordingURL },

    // Most important property is the livestream. The livestream 
    // object is attached to the event in the api scripts. It can 
    // return a static object or refer to the livestream entry in 
    // the store. Please refer to: @/api/events/sanitize

    livestream()  { return this.event.livestream() },
    playback_id() { return this.livestream.playbackId },
    active()      { return this.livestream.status == 'active' },

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

  <div :id="$id()">

    <pre> {{ livestream }} </pre>

      <section v-if="!active">
        <h2 v-if="event.is.soon()">The livestream starts {{ starts }}.</h2>
        <h2 v-else>The livestream is over. The recording will be available here shortly.</h2>
      </section>

      <main v-if="playback_id && active" >

        <div id="options">
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

        <div id="videoContainer">
          <Player 
            :livestream="livestream"
            :mode="current_mode"
          />
        </div>

        <!-- <Announcements /> -->

        <!-- <Chat /> -->

      </main>

  </div>
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
