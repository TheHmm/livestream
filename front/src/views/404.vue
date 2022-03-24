<script>
import { mapGetters } from 'vuex'
export default {
  name: 'NotFoundPage',
  computed: {
    ...mapGetters( 'ui', [
      'page_not_found_text'
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
    <p> {{ page_not_found_text }} </p>
  </main>
</template>
