<script>

import { defineAsyncComponent } from "vue"
import Marquee                  from '../Header/Marquee.vue'
import Banner                   from '../Header/Banner.vue'
import Viewers                  from './Viewers/index.vue'
import Announcements            from './Announcements/index.vue'
import Info                     from './Info/index.vue'
import Status                   from './Info/Status.vue'
import Options                  from './Options/index.vue'
import Network                  from '../Footer/Network.vue'
import Chat                     from '../Chat/index.vue'


// We lazy load our Player component, as it imports hls.js,
// which as a minified bundle, is still larger than all files
// in this project combined.

const Player = defineAsyncComponent(() => 
  import('./Player/index.vue')
)

export default {

  name : 'Livestream',

  components : {
    Marquee,
    Banner,
    Viewers,
    Announcements,
    Info,
    Status,
    Player,
    Options,
    Network,
    Chat,
    Status,
  },


  // This component inherits only the event fron it's parent
  // and handles the rest independently.

  props : {
    event: Object,
  },


  // The livestream property of the event is attached to it 
  // during API response sanitization in the store. It can 
  // return a static object or refer to the livestream entry  
  // in the store. Please refer to: @/store/events/sanitize

  computed : {  
    livestream()  { return this.event.livestream() },
    playback_id() { return this.livestream.playbackId },
    status()      { return this.livestream.status },
    active()      { return this.status == 'active' }, 
  },


  // Our WEB-ARIA labels for the 3 main regions of the live-
  // stream page.  

  data() {
    return {
      header_label : 'banner & announcements',
      middle_label : 'event information & livestream player',
      footer_label : 'options & chat'
    }
  },

}
</script>

  
<template>

  <header :aria-label="header_label">
    <Marquee 
      :marquee="event.marquee"
      :animate="!active"
    />
    <Banner />
    <Viewers />
    <Announcements />
  </header>

  <section :aria-label="middle_label" id="middle">
    <Info
      :event="event"
      :status="status"
    />
    <Player
      v-if="playback_id && active"
      :livestream="livestream"
    />
    <Status 
      v-else
      :status="status"
    /> 
  </section>
  
  <footer :aria-label="footer_label">
    <Options />
    <Network />
    <Chat 
      :event="event"  
    />
  </footer>

</template> 


<style scoped>

header {
  position         : relative;
  max-height       : var(--header-height);
}
header .marquee {
  height           : var(--marquee-height);
  z-index          : 1;
}

header #viewers {
  z-index          : 1;
}

header #announcements {
  z-index          : 1;
}

#middle {
  --back           : var(--accent);
  --fore           : var(--white);
  --border         : var(--dash) var(--fore);
  background-color : var(--back);
  box-shadow       : var(--shadow);
  height           : var(--middle-height);
  position         : relative;
  flex-grow        : 1;
  z-index          : 0;
  padding          : var(--size-s);
  padding-bottom   : var(--footer-height);
  transform        : translateY(100%);
  animation        : enter var(--enter) ease 0.1s forwards;
  transition       : background-color var(--very-slow) ease;
  display          : flex;
  flex-direction   : row-reverse;
  z-index          : 2;
}

#middle #info {
  flex-shrink      : 0;
  margin-left      : var(--size-s);
}

footer {
  max-height       : var(--footer-height);
  position         : fixed;
  bottom           : 0;
  width            : 100%;
  padding          : 0 var(--size-s);
  display          : flex;
  align-items      : flex-end;
  z-index          : 3;
}

footer >>> #network {
  margin           : 0.2rem var(--size-s);
  margin-right     : auto;
}

footer #chat_container {
  --distance       : 5rem;
  width            : calc(var(--side-width));
  position         : absolute;
  right            : 0;
  margin           : 0 var(--size-s);
 }

footer >>> #chat_container #chat .contents:focus-within,
footer >>> #chat_container #chat.expanded .contents {
  --height         : calc( 100vh - 18rem );
}


.mobile #middle {
  flex-direction   : column-reverse;
  justify-content  : flex-end;
  
  overflow : scroll;
}


.mobile #middle #player {
  flex-shrink: 0;
  /* height: unset; */
  /* height: 40%; */
  min-height: 40%;
  max-height: 60%;
}

.mobile #middle #info {
  flex-shrink      : 1;
  margin-left      : unset;
  margin-top       : var(--size-s);
}

.mobile #middle #status {
  max-height       : 30%;
}

.mobile footer {
  padding          : 0;
  flex-direction   : row-reverse;
  flex-wrap        : wrap;
}

.mobile footer {
  flex-direction   : column-reverse;
}

.mobile footer #chat_container {
  /* bottom           : var(--footer-height); */
  bottom           : 0;
  margin           : 0;
}
.mobile footer >>> #chat_container #chat .contents:focus-within,
.mobile footer >>> #chat_container #chat.expanded .contents {
  /* --height         : calc( 100vh - 23rem ); */
  --height         : 50vh;
}
.mobile footer >>> #chat_container #chat .contents {
  padding-bottom   : calc( var(--footer-height) + 1rem);
}

@keyframes enter {
  from { transform : translateY(100%) }
  to   { transform : translateY(0) }
}

</style>
