<script>

import Marquee from './Marquee.vue'
import Banner  from './Banner.vue'
import Network from './Network.vue'


// Our Header component; contains all status indicators
// such as the title and network info.

export default {
  name: 'Header',
  components: {
    Marquee,
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
    aria-label="Banner, viewer dots, and network information"
  >
    <Marquee />
    <Banner />
    <Network />
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
