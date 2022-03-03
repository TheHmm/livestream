<script>

import Player from './Player.vue'
// import Chat from '../components/Chat'
// import Announcements from '../components/Announcements'
export default {

  name: 'Livestream',

  props: {
    event: {
      type: Object
    }
  },

  components: {
    Player,
    // Chat,
    // Announcements,
  },

  data() {
    return {
      levels: [
        'only_cc',
        'only_audio',
        'lq_video',
        'hq_video',
        'hd_video',
      ],
      selected_level: 'hd_video'
    }
  },

  computed: {

    // Basic event properties.

    title()       { return this.event.title },
    starts()      { return this.event.starts },
    ends()        { return this.event.ends },
    recording()   { return this.event.recordingURL },

    // Most important property is the livestream.
    // The livestream object is attached to the event
    // in the api scripts. It can return a static object
    // or refer to the livestream entry in the store.
    // Please refer to: @/api/events/sanitize

    livestream()  { return this.event.livestream() },
    playback_id() { return this.livestream.playbackId },
    active()      { return this.livestream.status == 'active' }
    
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

        <div class="options">
          <label for="modes">mode:</label>
          <select 
            name="modes"
            v-model="selected_level"
          >
            <option 
              v-for="level in levels"
              :key="level"
              :value="level"
            >
              {{ level }}
            </option>
          </select>
        </div>

        <div id="videoContainer">
          <Player 
            :livestream="livestream"
            :level="selected_level"
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
