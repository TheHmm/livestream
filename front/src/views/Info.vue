<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Info',
  computed: {
    ...mapGetters( 'meta', [ 'about' ]),
  }
}
</script>
<template>
  <section :id="$id()">
    <h1>Info</h1>
    <section 
      v-if="about"
      v-html="$md( about )"
    >
    </section>
  </section>
</template>
<style scoped>
#about {
  max-width: var(--main-width);
}
</style>