<script>
import Donate from './Donate.vue'

export default {
  name: 'Header',
  components: { 
    Donate 
  },
}
</script>

<template>
  <footer
    aria-label="footer"
  >
    <Donate />
  </footer>
</template>

<style scoped>

footer {
  padding: 1rem;
  padding-top: 10rem;
}

</style>
