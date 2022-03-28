<script>

import Chat from '@/components/Livestream/Chat/index.vue'


// The Chat view. This view presents onlythe chat of a given
// event page.

export default {

  name       : 'ChatPage',

  components : { 
    Chat,
  },

  computed: {


    // We get our event object frmm the route slug. Note that
    // the event has already been fetched in the before_enter
    // route guard: @/router/guards/before_enter_event

    event()  { 
      return this.$store.getters[
        'events/current_event'
      ]
    },


    // We can set to hide the chat input in the display

    hide_input() {
      return this.$route.query.hide_input
    }

  },


  // We only need to connect to our socket server when we
  // enter the event page. In all other routes, socket 
  // networking is unnecessary.

  created() {
    this.$socket.client.connect()
  },


  // For the same reason, we disconnect from the socket
  // server before we leave this route.

  beforeUnmount() {
    this.$socket.client.disconnect()
  },


  // When we connect to the socket server, we need to
  // send everyone our uuid, even if the viewer hasn't
  // been stored to the database, this way, all visitors
  // can see each other and send emoji.

  sockets: {
    connect() {
      this.$log.info( 'SOCKET', 'Connected.' )
      this.$socket.client.emit('viewer', {
        uuid: this.$store.state.viewers.uuid,
      })
    },
  },


}
</script>

<template>
  <main 
    :id="$id()"
    :class="{ hide_input }"
    :style="{ ...event.accent }"
    aria-labelledby="event_title"
  >
    <Chat />
  </main>
</template>

<style scoped>

main {


  /* The event accennt color is created in Strapi as a valid */
  /* hsl() string and converted into the --h,  --sl and --l 
  /* CSS vars in the script: @/utils/colors */

  --accent         : hsl( var(--h), var(--s), var(--l) );
  --increment      : 9.6%;
  --max-l          : 96%;


  /* We produce 5 more shades of our accent color by adding */
  /* to the lightness of the original a defined increment */

  --dark-l         : calc( var(--l) + 1 * var(--increment) );
  --darker-l       : calc( var(--l) + 2 * var(--increment) );
  --mid-l          : calc( var(--l) + 3 * var(--increment) );
  --lighter-l      : calc( var(--l) + 4 * var(--increment) );
  --light-l        : min( 
    calc( var(--l) + 5 * var(--increment) ), 
    var( --max-l ) 
  );

  --accent-dark    : hsl( var(--h), var(--s), var(--dark-l));
  --accent-darker  : hsl( var(--h), var(--s), var(--darker-l));
  --accent-mid     : hsl( var(--h), var(--s), var(--mid-l));
  --accent-lighter : hsl( var(--h), var(--s), var(--lighter-l));
  --accent-light   : hsl( var(--h), var(--s), var(--light-l));


  /* Using the accent  colors in our app. */

  --back           : var(--accent-light);
  --focus          : 2px solid var(--accent);

  
  background-color : var(--back);

  height           : 100%;
  width            : 100%;
  display          : flex;
  flex-direction   : column;
  animation        : enter var(--very-slow) ease forwards;
}

@keyframes enter {
  from { background-color : transparent }
  to   { background-color : var(--back) }
}

#chatpage >>> #chat .contents {
  /* min-height: 100vh;
  max-height: 100vh; */
}
#chatpage >>> #chat .close {
  display: none;
}
#chatpage.hide_input {
  padding-bottom: 2px;
}
#chatpage.hide_input >>> #chat #message_form {
  display: none;

}

</style>
