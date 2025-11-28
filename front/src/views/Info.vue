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
#info {
  max-width: min( 50%, var(--main-width) );
}
.mobile #info {
  max-width: 100%;
}
</style>