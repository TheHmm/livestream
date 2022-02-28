<script>
import { mapState } from 'vuex'
export default {
  name: 'NotFound',
  computed: {
    ...mapState([
      'meta'
    ])
  }
}
</script>

<template>
  <main>
    <h2>404 Error</h2>
    <h3> {{ meta.pageNotFoundText }} </h3>
  </main>
</template>
