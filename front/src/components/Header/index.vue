<script>
import Banner from './Banner.vue'
import Network from './Network.vue'


// Our Header component; contains all status indicators
// such as the title and network info.

export default {
  name: 'Header',
  components: {
    Banner,
    Network,
  },
  computed: {
    hide_header() {
      return this.$route.meta.hide_header
    }
  }
}

</script>

<template>
  <header
    v-if="!hide_header"
    aria-label="Banner and network information"
  >
    <Banner />
    <section>
      <nav></nav>
      <Network />
    </section>
  </header>
</template>

<style scoped>
header {
  max-height : var(--header-height);
  width      : 100%;
  position   : sticky;
  top        : 0;
}
</style>
