<script>

import _throw   from '@/utils/throw'
import Header   from '@/components/Header/index.vue'
import Footer   from '@/components/Footer/index.vue'
import Viewers  from '@/components/Viewers/index.vue'
import Fallback from '@/views/Fallback.vue'


// Our App component. This wraps our routes in a router
// view with the <Component :is /> notation and handles
// the addition of mobile and accesibility CSS classes.

export default {

  name: 'App',

  components: {
    Header,
    Footer,
    Fallback,
    Viewers,
  },


  // Our indicator that the client is connected to the
  // internet and the API is functional. This object being
  // fulfilled allows normal routing to begin.

  data() {
    return { meta: null }
  },

  computed: {


    // Produces our mobile class

    mobile() {
      return this.$store.state.meta.mobile
    },


    // Produces our accessibility classes by first looking in
    // the store for our ui options and then looking in the
    // route query to see what their values have been set to.
    // returns in accessibility paramater as a class name
    // only if set to true in the query parameters, for ex:
    // '?reduce_depth=true' => body.reduce_depth

    access() {
      return Object
      .keys( this.$store.state.meta.ui )
      .reduce( ( acc, key ) => (
        { ...acc, [key]: this.$route.query[key] == 'true' }
      ), {} )
    },

    // miscellaneous classes that can be added by ESP modules

    misc() {
      return this.$store.state.meta.misc
    },


    // The current event, as selected by the route path
    // e.g. 'live.thehmm.nl/event-slug', pulled from the
    // store. Only used to get accent colors

    event() {
      return this.$store.getters[ 'events/get_event' ](
        this.$route.params.slug
      )
    },


    // If the route points to an event, get it's accent to
    // theme the whole page

    styles() {
      return this.event?.styles
    },



  },


  // This is first request to the Strapi API that we make.
  // If this throws an error, than it's likely something is
  // wrohg with Strapi. We indicate this by routing to the
  // error page.

  async created() {
    this.$store.dispatch( 'meta/handle_mobile' )
    try {
      this.meta = await this.$store.dispatch( 'meta/get_meta' )
      this.$socket.client.connect()
    } catch ( error ) {
      _throw( error )
      this.$router.push({
        name:'Error',
        query: { type: error.message }
      })
      throw error
    }
  },

  beforeUnmount() {
    this.$socket.client.disconnect()
  },

  sockets: {
    connect() {
      this.$log.info( 'SOCKET', 'Connected.' )
    },
    disconnect() {
      this.$log.info( 'SOCKET', 'Disconnected.' )
    }
  },

}

</script>

<template>
  <body
    :id="[ $id( $route.name )]"
    :class="{ mobile, ...access, ...misc }"
    :style="{ ...styles }"
  >

    <Header />

    <main :aria-label="`${ $route.name } page`">
      <router-view v-slot="{ Component }">
        <transition name="flyall" mode="out-in" type="animation" appear >
          <suspense :timeout="0">
            <template #default>
              <Component :is="Component" />
            </template>
            <template #fallback >
              <Fallback :message="'Loading...'" />
            </template>
          </suspense>
        </transition>
      </router-view>
    </main>

    <!-- <Viewers v-if="event" /> -->

    <Footer />

  </body>
</template>


<style>

/* Base styles are imported from here: */

@import '@/assets/css/base.css';
@import '@/assets/css/input.css';

body {
  opacity          : 0;
  background-color : var(--back);
  background-image : var(--back-img);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  animation        : enter var(--enter) ease forwards;
  transition       : background-color var(--very-slow) ease;
  height           : 100%;
  width            : 100%;
  display          : flex;
  flex-direction   : column;
}

@keyframes enter {
  from { opacity   : 0; }
  to   { opacity   : 1; }
}


body main {
  height           : var(--middle-height);
  position         : relative;
  flex-grow        : 1;
  z-index          : 2;
  /* margin-top       : var(--header-height); */
}

body main > section {
  padding-inline: 1rem;
}


body#chatpage.hide_input footer {
  display          : none;
}

body#accent #announcements {
  display          : none;
}

body#accent {
  --very-fast      : 0s;
  --fast           : 0s;
  --slow           : 0s;
  --very-slow      : 0s;
}
body#accent * {
  animation        : none  !important;
  transform        : none  !important;
  opacity          : unset !important;
}

body.mobile {
  overflow         : scroll;
}


body.mobile main {
  flex-direction   : column-reverse;
  justify-content  : flex-end;
  flex-grow        : 1;
  /* overflow         : scroll; */
}
body.mobile #network {
  display: none;
}
body#savepage.mobile,
body#savepage {
  height: unset;
}
body#savepage.mobile main,
body#savepage main {
  display: block;
  height: unset;
}


body.rotate main  {
  animation: rotate 30s linear forwards;
}

@keyframes rotate {
    0% {
        transform: perspective(1000px) rotateY(0deg);
    }
    100% {
        transform: perspective(1000px) rotateY(360deg);
    }
}

</style>
