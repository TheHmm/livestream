<script>
import Network from './Network.vue'

export default {

  name: 'Header',
  components: {
    Network
  }

}

</script>

<template>
  <header>

    <h1>The Hmm Livestream</h1>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
    <br>
    <Network />

  </header>  
</template>

<style>

</style>
