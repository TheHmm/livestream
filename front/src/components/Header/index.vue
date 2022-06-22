<script>

import Marquee                  from './Marquee.vue'
import Banner                   from './Banner.vue'
import Viewers                  from './Viewers/index.vue'
import Network from '../Footer/Network.vue'

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
  <header aria-label="banner, viewers & announcements">
    <Marquee />
    <Banner />
    <!-- <Network /> -->
    <Viewers />
  </header>
</template>

<style scoped>

header {
  position         : relative;
  max-height       : var(--header-height);
}
header .marquee {
  height           : var(--marquee-height);
  z-index          : 1;
}

header #viewers {
  z-index          : 1;
}



</style>
