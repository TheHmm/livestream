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
  --size:1.2rem;
  --padding: 1rem;
  --dot-height: var(--size);
  --dot-width: var(--size);
  --gap: calc( 1 * var(--dot-width) );
  width: 100%;
}
#lower_header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: stretch;
  gap: var(--gap);
  padding-inline: var(--padding);
}

.mobile header {
  --size:0.4rem;
  --padding: 0.5rem;
}
.mobile #lower_header {
  flex-direction: column;
}
</style>
