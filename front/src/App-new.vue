<script>

import { mapState }     from 'vuex'
import { mapMutations } from 'vuex'
import store            from '@/store'
import _throw           from '@/router/throw'
import Fallback         from '@/views/Fallback.vue'
import Header           from '@/components/Header/index.vue'
import Footer           from '@/components/Footer/index.vue'


// Our App component. This wraps our routes in a router
// view with the <Component :is /> notation and handles
// the addition of mobile and accesibility CSS classes.

export default {

  name: 'App',

  components: {
    Fallback,
    Header,
    Footer
  },

  async setup() {
    let meta
    try {
      meta = await store.dispatch( 'meta/get_meta' )
      console.log(meta)
    } catch ( error ) {
      this.$router.push( _throw( error ) )
    }
    return { meta }
  },


  // Our indicator that the client is connected to the
  // internet and the API is fuctional. This bject being
  // fulfilled allows normal routing to begin.

  data() {
    return {
      // meta: null,
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
    }

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

  // async mounted() {
  //   try {
  //     this.meta = await this.$store.dispatch( 'meta/get_meta' )
  //   } catch ( error ) {
  //     this.$router.push( _throw( error ) )
  //   }
  // },



}

</script>

<template>
  <suspense>
    <template #default>
      <main
        :id="$id()"
        aria-label="Event archive"
      >
        <Header />
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component
              :is="Component"
              :class="{
                mobile,
                ...access
              }"
            />
          </transition>
        </router-view>
        <Footer
          :desired_tabs="[
            'access',
            'donate'
          ]"
        />
      </main>
    </template>
    <template #fallback>
      <Fallback
        message="Loading..."
      />
    </template>
  </suspense>
</template>


<style>

/* Base styles are imported from here: */

@import '@/assets/css/base.css';
@import '@/assets/css/input.css';

/* For accessibily reasons, I removed vue's default root */
/* <div> and instead gave the document's <body> tag the */
/* #app id. This doesn't seem to create any problems yet. */
/* See file: @/front/index.html */

.fade-leave-active {
  opacity          : 1;
  transition       : opacity var(--enter) ease;
  transition-delay : 2s;
}


main {

  --accent         : var(--black);
  --back           : var(--white);
  --focus          : 2px solid var(--accent);


  background-color : var(--back);
  height           : 100%;
  width            : 100%;
  display          : flex;
  flex-direction   : column;
  animation        : enter var(--very-slow) ease forwards;

}

main >>> header .marquee {
  --back           : var(--black);
  --fore           : var(--white);
}

main >>> footer #network {
  --fore           : var(--black);
}

main >>> .middle {
  --back           : var(--accent-mid);
  --focus          : 2px solid var(--accent);
  background-color : var(--back);
  box-shadow       : var(--shadow);
  height           : var(--middle-height);
  position         : relative;
  flex-grow        : 1;
  padding          : var(--size-s);
  padding-bottom   : var(--footer-height);
  transform        : translateY(100%);
  animation        : enterMiddle var(--enter) ease var(--delay) forwards;
  transition       : background-color var(--very-slow) ease;
  display          : flex;
  flex-direction   : row-reverse;
  z-index          : 2;
}

@keyframes enter {
  from { background-color : transparent }
  to   { background-color : var(--back) }
}

@keyframes enterMiddle {
  from { transform : translateY(100%) }
  to   { transform : translateY(0) }
}

main.mobile >>> .middle {
  flex-direction   : column-reverse;
  justify-content  : flex-end;
  flex-grow        : 1;
  overflow         : scroll;
}

</style>
