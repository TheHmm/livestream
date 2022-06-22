<script>

import { mapState }     from 'vuex'
import { mapMutations } from 'vuex'
import _throw           from '@/router/throw'
import Fallback         from '@/views/Fallback.vue'
import Header           from '@/components/Header/index.vue'
import Footer           from '@/components/Footer/index.vue'
import Announcements    from '@/components/Header/Announcements/index.vue'


// Our App component. This wraps our routes in a router
// view with the <Component :is /> notation and handles
// the addition of mobile and accesibility CSS classes.

export default {

  name: 'App',

  components: {
    Fallback,
    Header,
    Footer,
    Announcements,
  },


  // Our indicator that the client is connected to the
  // internet and the API is fuctional. This bject being
  // fulfilled allows normal routing to begin.

  data() {
    return {
      meta: null,
    }
  },


  // Produces our mobile and accessibility classes.

  computed: {

    ...mapState( 'meta', [
      'mobile',
      'ui'
    ]),

    access() {
      return Object
      .keys( this.ui )
      .reduce( ( acc, key ) => (
        { ...acc, [key]: this.$route.query[key] == 'true' }
      ), {} )
    },

    desired_tabs() {
      return this.$route.meta.desired_tabs
    },

    event() {
      return this.$store.getters[ 'events/get_event' ](
        this
        .$route
        .params
        .slug
      )
    },

    accent() {
      return this.event?.accent
    },

  },

  methods: {

    ...mapMutations( 'meta', [
      'SET_MOBILE'
    ]),

    check_mobile() {
      return window.innerWidth < 700
    },

  },

  created() {
    this.SET_MOBILE( this.check_mobile() )
    window.onresize = () => {
      this.SET_MOBILE( this.check_mobile() )
    }
  },


  // This is first request to the Strapi api that we make. It
  // happens here and not in any of the router guards so that
  // the App can mount a loading or error page. The custom
  // _throw function handles errors with the router.

  async mounted() {
    try {
      this.meta = await this.$store.dispatch( 'meta/get_meta' )
    } catch ( error ) {
      this.$router.push( _throw( error ) )
    }
  },



}

</script>

<template>

  <!-- For accessibily reasons, I removed vue's default root
  <div> and instead gave the document's <body> tag the #app
  id. See file: @/front/index.html -->

  <main
    :id="$id( $route.name )"
    :class="[ mobile, { ...access } ]"
    :style="{ ...accent }"
  >

    <Header />

    <section class="middle">
      <router-view v-slot="{ Component }">
        <transition
          name="fly"
          mode="out-in"
          appear
        >
          <Component
            v-if="meta"
            :is="Component"
          />
          <Fallback
            v-else
            message="Loading..."
          />
        </transition>
      </router-view>
    </section>

    <Announcements />

    <Footer
      :desired_tabs="desired_tabs"
    />

  </main>
</template>


<style>

/* Base styles are imported from here: */

@import '@/assets/css/base.css';
@import '@/assets/css/input.css';

main {
  opacity          : 0;
  background-color : var(--back);
  animation        : enter var(--enter) ease forwards;
  transition       : background-color var(--very-slow) ease;
  height           : 100%;
  width            : 100%;
  display          : flex;
  flex-direction   : column;
}

@keyframes enter {
  from { opacity: 0; }
  to   { opacity: 1; }
}


main .middle {
  height           : var(--middle-height);
  position         : relative;
  flex-grow        : 1;
  z-index          : 2;
}




main.mobile >>> .middle {
  flex-direction   : column-reverse;
  justify-content  : flex-end;
  flex-grow        : 1;
  overflow         : scroll;
}

main#chatpage.hide_input footer {
  display: none;
}

main#chatpage #middle,
main#accent #middle {
  padding: 0;
}
main#accent header ,
main#accent footer,
main#accent #announcements {
  display: none;
}

main.mobile {
  overflow : scroll;
}

main.mobile .middle {
  flex-direction   : column-reverse;
  justify-content  : flex-end;
  flex-grow        : 1;
  overflow         : scroll;
}



</style>
