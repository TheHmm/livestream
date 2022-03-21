<script>

import { mapMutations, mapState } from 'vuex'

import Header from './components/Header/index.vue'
import Footer from './components/Footer/index.vue'
import Banner from './components/Header/Banner.vue'

export default {

  name: 'App',

  components: { 
    Header,
    Footer,
    Banner
  },

  data() {
    return {
      ready: false,
    }
  },

  computed: {
    ...mapState( 'ui', [
      'mobile',
      'options'
    ]),
    reduce_motion() {
      return this.options.reduce_motion.value
    }
  },

  methods: {
    ...mapMutations( 'ui', [ 'SET_MOBILE' ] ),
    check_if_mobile() {
      return window.innerWidth < 700
    },   
  },

  created() {
    this.SET_MOBILE( this.check_if_mobile() )
    window.onresize = () => {
      this.SET_MOBILE( this.check_if_mobile() )
    }
  },


  async mounted() {  
    try {
      await this.$store.dispatch( 'livestream/get_livestream' )
      await this.$store.dispatch( 'meta/get_meta' )
      this.ready = true
    } catch ( error ) {
      logger.error(error)
      this.$router.push('404')
    }
  },



}

</script>

<template>
  <transition 
    name="fade"
    mode="in-out"
  >

    <RouterView 
      v-if="ready"
      :class="{ 
        mobile,
        reduce_motion
      }"
    />

    <main
      v-else
      class="placeholer"
    >
      <Banner />
    </main>

  </transition>
</template>


<style>


/* Base styles for the whole app */

@import '@/assets/base.css';


/*
 * For accessibily reasons, I removed vue's default root
 * <div> and instead gave the document's <body> tag the
 * #app id. This doesn't seem to create any problems yet.
 * See file: @/front/index.html
 */


main.placeholer {
  position: absolute;
  width: 100%;
}
main.placeholer #banner {
  margin: 2rem auto;
}

</style>
