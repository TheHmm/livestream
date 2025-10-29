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
    Player,
    Status,
    Chat,
  },


  // This component inherits only the event fron it's parent
  // and handles the rest independently.

  props : { event: Object },


  // The livestream property of the event is attached to it
  // during API response sanitization in the store. It can
  // return a static object or refer to the livestream entry
  // in the store. Please refer to: @/store/events/sanitize

  computed : {
    is_in_past()  { return this.event?.is_in_past },
    livestream()  { return this.$store.getters[ 'livestream/current_livestream' ] },
    playback_id() { return this.livestream?.playbackId },
    status()      { return this.livestream?.status || 'unavailable' },
    show_player() { return (
      this.playback_id && (
        this.status == 'active' ||
        this.status == 'ready'
      )
    )}
  },

  methods: {
    async log_event_visit() {
      return await this.$store.dispatch(
        'events/log_event_visit',
        this.$route.params.slug
      )
    }
  },


  // If the visit happens in the future, after the event is
  // over, we inform strapi.

  created() {
    if ( this.is_in_past ) {
      this.log_event_visit()
    }
  }

}

</script>


<template>
  <Info :event="event" />
  <Player v-if="show_player" :event="event" :livestream="livestream" />
  <Status v-else :status="status" />
  <Chat :event="event" />
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
  /* --height         : calc( 100vh - 18rem ); OLD */
  --height         : calc( 100vh - ( var(--header-height) + var(--footer-height) ));
}



.mobile #player {
  max-height       : 60%;
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
