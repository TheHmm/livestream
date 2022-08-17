<script>

import Marquee from './Marquee.vue'
import Banner  from './Banner.vue'
import Network from './Network.vue'
import Viewers from './Viewers/index.vue'


// Our Header component; contains all status indicators
// such as the title, viewer dots, and network info.

export default {
  name: 'Header',
  components: {
    Marquee,
    Banner,
    Viewers,
    Network,
  }
}

</script>

<template>
  <header aria-label="Banner, viewer dots, and network information">
    <Marquee />
    <Banner />
    <Network />
    <Viewers />
  </header>
</template>

<style scoped>
header {
  max-height : var(--header-height);
}
</style>
