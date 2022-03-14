<script>

import Header from './components/Header/index.vue'
import Footer from './components/Footer/index.vue'

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


  },

  created() {


  },


  mounted() {
   
  },



}

</script>

<template>
  
  <Header />
  <RouterView />
  <Footer />

</template>

<style>
@import '@/assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

</style>
