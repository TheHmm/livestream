<script>
import { mapState } from 'vuex'
export default {
  name: 'NotFoundPage',
  computed: {
    ...mapState([
      'meta'
    ])
  }
}
</script>

<template>
  <main
    :class="$id()"
    aria-labelledby="error_label"
  >
    <h2 id="error_label">404 Error</h2>
    <p> {{ meta.pageNotFoundText }} </p>
  </main>
</template>
