<script>

export default {

  name: 'Header',

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

  </header>  
</template>

<style scoped>

header {
  padding-bottom: 3em;
}

nav {
  margin-bottom: var(--size-s);
}
nav a {
  margin-right: var(--size-s);
}

</style>
