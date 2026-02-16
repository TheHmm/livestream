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
    },
    landscape() {
      return this.$store.state.meta.landscape
    },
  }
}

</script>

<template>
  <header
    v-if="!hide_header"
    aria-label="Banner and network information"
  >
    <Banner v-if="!landscape" />
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
  position: sticky;
  top: 0;
  z-index: 4;
  /* background-color: red; */
  height: var(--header-height);  
  max-height: var(--header-height);
  display: flex;
  flex-direction: column;
}
#lower_header {
  width: 100%;
  display: flex;
  align-items: center;
  /* justify-content: stretch; */
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
.landscape header {
  padding-block: var(--padding);
}

.reduce_depth header {
  background-color: var(--back);
  padding-bottom: var(--padding);
  border-bottom: 1px solid;
}

</style>
