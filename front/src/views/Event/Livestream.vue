<script>

import { defineAsyncComponent } from "vue"
import Info                     from '@/components/Livestream/Info/index.vue'
import Status                   from '@/components/Livestream/Info/Status.vue'
import Chat                     from '@/components/Chat/index.vue'


// We lazy load our Player component, as it imports hls.js,
// which as a minified bundle, is still larger than all files
// in this project combined.

const Player = defineAsyncComponent(() =>
  import('@/components/Livestream/Player/index.vue')
)

export default {

  name : 'Livestream',

  components : {
    Info,
    Status,
    Player,
    Chat,
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


}

</script>


<template>


    <Info
      :event="event"
      :status="status"
    />
    <Player
      v-if="playback_id && ( active || ready )"
      :livestream="livestream"
    />
    <Status
      v-else
      :status="status"
    />
    <Chat
      :event="event"
    />


</template>


<style scoped>

#info {
  flex-shrink      : 0;
  margin-left      : var(--size-s);
}

#chat_container {
  --distance       : 5rem;
  --fore           : var(--black);
  width            : calc(var(--side-width));
  position         : absolute;
  bottom           : 0;
  right            : 0;
  margin           : 0 var(--size-s);
}

#chat_container >>> #chat .contents:focus-within,
#chat_container >>> #chat.expanded .contents {
  --height         : calc( 100vh - 18rem );
}



.mobile #player {
  max-height: 60%;
}

.mobile #info {
  flex-shrink      : 1;
  margin-left      : unset;
  margin-top       : var(--size-s);
}

.mobile #status {
  max-height       : 30%;
}

.mobile #chat_container {
  /* bottom           : var(--footer-height); */
  margin           : 0;
}
.mobile #chat_container >>> #chat .contents:focus-within,
.mobile #chat_container >>> #chat.expanded .contents {
  /* --height         : calc( 100vh - 23rem ); */
  /* --height         : 100%; */
}
.mobile #chat_container >>> #chat .contents {
  padding-bottom   : calc( var(--footer-height) + 1rem);
}


</style>
