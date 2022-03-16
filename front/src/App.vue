<script>

import Header from './components/Header/index.vue'
import Footer from './components/Footer/index.vue'
import { mapMutations, mapState } from 'vuex'

export default {

  name: 'App',

  components: { 
    Header,
    Footer
  },

  data() {
    return {
    }
  },

  computed: {
    
    
   
  },

  methods: {

    ...mapMutations([
      'SET_MOBILE'
    ]),

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


  mounted() {
   
  },



}

</script>

<template>
  
  <!-- <Header /> -->
  <RouterView />
  <!-- <Footer /> -->

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

body {    
  /* box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column; */
}

</style>
