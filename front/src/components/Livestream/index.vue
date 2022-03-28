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
import Chat                     from './Chat/index.vue'


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
    <Chat />
  </footer>

</template> 


<style scoped>

header {
  position         : relative;
  max-height       : var(--header-height);
}
header .marquee {
  height           : var(--marquee-height);
  z-index          : 3;
}

header #announcements {
  z-index          : 3;
}

#middle {
  --back           : var(--accent);
  --fore           : var(--white);
  --border         : var(--dash) var(--fore);
  background-color : var(--back);
  box-shadow       : var(--shadow);
  max-height       : 80%;
  /* max-height       : var(--middle-height); */
  width            : 100%;
  flex-grow        : 1;
  flex-shrink      : 1;
  flex-basis       : 30%;
  padding          : 1rem;
  padding-bottom   : calc( var(--footer-height) + 1rem );
  display          : flex;
  flex-direction   : row-reverse;
  align-items      : stretch;
  justify-content  : stretch;
  transition       : background-color var(--very-slow) ease;
  z-index          : 0;
  transform        : translateY(100%);
  animation        : enter var(--enter) ease 0.1s forwards;
}
@keyframes enter {
  from { transform : translateY(100%) }
  to { transform   : translateY(0) }
}
#middle #info {
  flex-shrink      : 0;
  margin-left      : 1rem;
}

footer {
  --back           : var(--accent);
  position         : fixed;
  bottom           : 0;
  flex-grow        : 0;
  width            : 100%;
  height           : 100%;
  max-height       : var(--footer-height);
  padding          : 0 1rem;
  display          : flex;
  align-items      : flex-end;
}
footer #options {
}
footer #network {
  margin           : 0.2rem 1rem;
  margin-right     : auto;
}
footer #chat_container {
  margin-left      : 1rem;
  width            : calc(var(--side-width));
}

.mobile #middle {
  flex-direction   : column-reverse;
  align-items      : stretch;
}
.mobile #middle #status {
  width            : unset;
  max-height       : 30%;
}
.mobile footer {
  max-height       : 6rem;
  flex-direction   : row-reverse;
}
.mobile footer {
  flex-direction   : column-reverse;
}
</style>
