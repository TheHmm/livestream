<script>
import Banner from './Banner.vue'
import MainNav from './MainNav.vue'
import Network from './Network.vue'


// Our Header component; contains all status indicators
// such as the title and network info.

export default {
  name: 'Header',
  components: {
    Banner,
    MainNav,
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
    <div id="lower_header">
      <MainNav />
      <Network />
    </div>
  </header>
</template>

<style scoped>
header {
  max-height : var(--header-height);
  width      : 100%;
  position   : sticky;
  top        : 0;
}
#lower_header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-inline: 1rem;
}
</style>
