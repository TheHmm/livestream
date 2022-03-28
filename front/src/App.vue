<script>

import { mapState }     from 'vuex'
import { mapMutations } from 'vuex'
import _throw           from '@/router/throw'
import Fallback         from '@/views/Fallback.vue'


// Our App component. This wraps our routes in a router
// view with the <Component :is /> notation and handles 
// the addition of mobile and accesibility CSS classes.

export default {

  name: 'App',

  components: { 
    Fallback 
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
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component 
        v-if="meta" 
        :is="Component" 
        :class="{ 
          mobile, 
          ...access
        }"
      />
      <Fallback 
        v-else 
        message="Loading..."
      />
    </transition>
  </router-view>
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

</style>
