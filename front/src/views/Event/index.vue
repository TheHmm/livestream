<script>

// The Event view. This view wraps the child route component.
// This could be the livestream component or chat component.
// It also creates base styles to work from and handles 
// connection to the socket server.

import Header   from '@/components/Header/index.vue'
import Footer   from '@/components/Footer/index.vue'

export default {

  name : 'EventPage',

  components : {
    Header,
    Footer,
  },


  // We get our event object frmm the route slug. Note that
  // the event has already been fetched in the before_enter
  // route guard: @/router/guards/before_enter_event

  computed: {
    event() { 
      return this.$store.getters[
        'events/current_event'
      ]
    },
    hide_input() {
      return this.$route.query.hide_input
    } 
  },


  // Authenticate on load, this wayt you can send messages 
  // immediately

  methods: {
    async authenticate() {
      return await this.$store.dispatch(
        'viewers/authenticate'
      )
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
    async connect() {
      this.$log.info( 'SOCKET', 'Connected.' )
      this.$socket.client.emit('viewer', {
        uuid: this.$store.state.viewers.uuid,
      })
      await this.authenticate()
    },
  },


}
</script>

<template>
  <main
    :id="$id()"
    :class="[
      $id( $route.name ),
      { hide_input }
    ]"
    :style="{ 
      ...event.accent 
    }"
    aria-labelledby="event_title"
  >

    <Header />

    <section 
      id="middle"
      aria-label="event information, livestream player & chat" 
    >

      <router-view v-slot="{ Component }">
        <component 
          :is="Component" 
          :event="event"
        />
      </router-view>

    </section>

    <Footer />

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
  animation        : enterMiddle var(--enter) ease 0.1s forwards;
  transition       : background-color var(--very-slow) ease;
  display          : flex;
  flex-direction   : row-reverse;
  z-index          : 2;
}

main.chatpage.hide_input footer {
  display: none;
}

main.chatpage #middle,
main.accent #middle {
  padding: 0;
}
main.accent header ,
main.accent footer {
  display: none;
}

main.mobile {
  overflow : scroll;
}

main.mobile #middle {
  flex-direction   : column-reverse;
  justify-content  : flex-end;
  flex-grow        : 1;
  overflow         : scroll;
}


@keyframes enter {
  from { background-color : transparent }
  to   { background-color : var(--back) }
}

@keyframes enterMiddle {
  from { transform : translateY(100%) }
  to   { transform : translateY(0) }
}

</style>
