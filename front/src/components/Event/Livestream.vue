<script>

import { time } from '@/utils'

// import BodyText from '../components/BodyText'
// import Video from '../components/Video'
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
    // BodyText,
    // Video,
    // Chat,
    // Announcements,
  },

  data() {
    return {
      muted        : true,
      playing      : true,
      elapsed_time : null,
      desires_time : null,
    }
  },

  computed: {

    // Basic event properties.

    title()       { return this.event.title },
    starts()      { return this.event.starts },
    ends()        { return this.event.ends },
    human_start() { return time.human_format( this.starts ) },
    recording()   { return this.event.recordingURL },

    // Most important property is the livestream.
    // The livestream object is attached to the event
    // in the api scripts. It can return a static object
    // or refer to the livestream entry in the store.
    // Please refer to: @/api/events/sanitize_event

    livestream()  { return this.event.livestream() },
    
  },

}
</script>
  
<template>

  <div :id="$id()">

    <pre> {{ livestream }} </pre>

      <!-- <body-text v-if="!active && !recording">
        <section>
          <h2>This event starts {{ human_start }}.</h2>
        </section>
      </body-text>

      <main v-else>

        <div id="videoContainer">
          <Video 
            :livestream="livestream"
            :desires_time="desires_time"
            :muted="muted"
            :playing="playing"
            @elapsed_time="elapsed_time = $event"
          />
        </div>

        <Announcements />

        <Chat />

      </main> -->

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
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  overflow: hidden;
}

#videoContainer {
  position: absolute;
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
