<script>
import { mapGetters } from 'vuex'
// import Video from '../components/Video'
// import Announcements from '../components/Announcements'
// import Chat from '../components/Chat'
// import Button from '../components/Button'
// import Tracker from '../components/Tracker'
// import BodyText from '../components/BodyText'

// import moment from 'moment-timezone'
// import { mapState } from 'vuex'

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
    // Button,
    // Tracker,
    // Announcements,
  },
  data() {
    return {
      eventEnded: null,

      muted: true,
      playing: true,
      fullscreen: false,
      elapsedTime: null,
      desiresPosition: null,

      timeoutID: null,
      uiLocked: false,
      uiHidden: false,
    }
  },
  computed: {


    // Basic event properties.

    title() { 
      return this.event.title 
    },
    starts() { 
      return this.event.starts 
    },
    ends() { 
      return this.event.ends 
    },
    humanStart() { 
      return (
        moment
        .tz( this.starts, 'Europe/Amsterdam' )
        .format( 'dddd DD MMMM [at] HH:mm z' )
      ) 
    },
    recordingURL() { return this.event.recordingURL },


    // Most important property is the livvestream.

    ...mapGetters( 'livestream', [ 'livestream' ] ),

    livestream() {
      // return this.$store.getters[ 'livestream/get_livestream' ]
      return this.event.livestream()
    },


    // stream() { return (
    //   this.eventEnded && this.recordingURL ? {
    //     url: this.recordingURL,
    //     status: 'active',
    //   } : this.livestream 
    // )},
    // active() { return this.stream.status === 'active' },
    

  },
  watch: {
    livestream() {
      // this.eventEnded = this.didEventEnd()
    }
  },

  created() {
    // this.eventEnded = this.didEventEnd()
  },

  // mounted() {

  //   this.timeoutID = setTimeout(() => {
  //     this.hideUI()
  //   }, 4000)

  // },


  methods: {

    handleMovement(e) {
      this.uiLocked = this.isInteracting(e)
      this.showUI()
      this.resetTimer()
    },

    isInteracting(e) {
      return (
        e.clientX > window.innerWidth - 350 ||
        e.clientY > window.innerHeight - 80
      )
    },

    resetTimer() {
      clearTimeout(this.timeoutID)
      this.timeoutID = setTimeout(() => { 
        this.hideUI()
      }, 4000) 
    },

    hideUI() {
      this.uiHidden = true
    },

    showUI() {
      this.uiHidden = false
    },

    didEventEnd() { 
      const 
        end = new Date(this.endTimeOfEvent),
        currentTime = new Date(),
        timeTillEndEvent = this.toHours(end - currentTime)

      console.log('The talk ends in:', timeTillEndEvent, 'hours')

      return timeTillEndEvent < 0
    },

    toHours(ms) {
      return ms / 3600000
    }


  }
}
</script>
  
<template>

  <div :id="$id()">

    <pre> {{ livestream }} </pre>

      <!-- <body-text v-if="!active && !recordingURL" :model="'flora01'">
        <section v-if="eventEnded">
          <h2>The live transmission has ended. Thanks for joining!</h2>
        </section>
        <section v-else>
          <h2>This live transmission starts {{ humanStart }}.</h2>
        </section>
      </body-text>

      <main 
        v-else
        :class="[
          { hiddenUI: uiLocked ? false : uiHidden }
        ]"
        @mousemove="handleMovement($event)"
        @mousedown="handleMovement($event)"
      >

        <div id="videoContainer">
          <Video 
            :stream="stream"
            :desiresPosition="desiresPosition"
            :muted="muted"
            :playing="playing"
            :fullscreen="fullscreen"
            @unfullscreened="fullscreen = false"
            @elapsed="elapsedTime = $event"
          />
        </div>

        <Announcements />

        <div class="controls">
          <Button
            :name="muted ? 'unmute' : 'mute'"
            :on="muted"
            @click.native="muted=!muted"
          />
          <Button
            :name="playing ? 'pause' : 'play'"
            :on="!playing"
            @click.native="playing=!playing"
          />
          <Button
            class="fullscreen"
            :name="'⤢'"
            @click.native="fullscreen = true"
          />
          <Tracker
            :elapsedTime="elapsedTime"
            @desiresPosition="desiresPosition = $event"
          />
        </div>

        <Chat
          v-if="!eventEnded || eventEnded && event.messages.length > 0"
          @scroll.native="handleMovement($event)"
          @keydown.native="handleMovement($event)"
        />

      </main> -->

  </div>
</template>

<script>

</script>

<style scoped>

#livestream {
  /* position: relative; */
  height: 100%; width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  overflow: hidden;
}

.userCount {
  position: absolute;
  right: 0;
  top: 0;
}

.center {
  flex: 1 0;
  margin: auto;
  display: flex;
  min-height: 0;
  align-items: center;
  /* max-height: 100%; */
}

main {
  /* flex: 0 0 100%; */
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  /* margin: auto; */
  min-height: 0;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  overflow: hidden;
}

#videoContainer {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  flex-direction: column;
  overflow: hidden;
}

.controls {
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(100% - 350px);
  display: flex;
  align-items: stretch;
  overflow: visible;
  transition: all 0.3s ease;
}

.tracker,
.button.pause,
.button.play,
.button.fullscreen,
.button.mute,
.button.unmute {
  flex-grow: 0;
  margin: 10px;
  margin-right: 0;
  /* position: absolute;
  bottom: 0;
  left: 0;
  margin: 10px; */
}

.tracker {
  flex-grow: 1;
  /* margin: 10px; */
}

#livestream .hiddenUI .controls {
  bottom: -60px;
  opacity: 0;
}

#livestream .hiddenUI {
  cursor: none;
}
#livestream .hiddenUI #chatContainer {
  right: -400px;
}
#livestream .hiddenUI #annContainer {
  /* left: -400px; */
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
.mobile .controls {
  position: relative;
  display: none;
}
.mobile .controls .tracker {
  position: absolute;
  top: -35px;
  height: 35px;
  width: 100vw;
  margin: 0;
  overflow: visible;

}


.mobile #livestream .hiddenUI .controls {
  bottom: unset;
  opacity: unset;
}

.mobile #livestream .hiddenUI {
  cursor: unset;
}

.mobile #livestream .hiddenUI #chatContainer {
  right: unset;
}

</style>
