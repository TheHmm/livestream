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
  <header
    aria-label="header"
    role="banner"
  >

    <h1 id="title">The Hmm Livestream</h1>
    <nav
      role="navigation"
      aria-label="main navigation"
    >
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
    <Network />

  </header>  
</template>

<style scoped>

header {
  padding-bottom: 3em;
}

nav {
  margin-bottom: 1rem;
}
nav a {
  margin-right: 1rem;
}

</style>
