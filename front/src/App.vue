<script>

import   Header    from './components/Header/index.vue'

export default {

  name: 'App',

  components: { 
    Header
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

</template>

<style>
@import '@/assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}
nav a {
  margin-right: 1em;
}

</style>
