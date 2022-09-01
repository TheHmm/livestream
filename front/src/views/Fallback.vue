<script>

import Error from '@/components/Utils/Error.vue'

// Fallback components that displayss a loading, error,
// or other type of message. Keeps the Hmmm banner up
// while the App is doing other things

export default {

  name:  "Fallback",
  components: { Error },


  // This component is mounted either manually by passigg
  // it a message or through the router as an error page.

  props: {
    message: {
      type: String,
      default: ''
    },
  },

  computed: {
    error() {
      return this.$store.state.meta.error
    },
    is_error() {
      return this.error
    },
    is_loading() {
      return this.message == 'Loading...'
    }
  }

}
</script>


<template>
  <section :class="[ $id(), { is_error, is_loading }]">
    <Error v-if="is_error" />
    <section v-else v-html="$md( message )"/>
  </section>
</template>


<style scoped>

section {
  max-width  : min(80%, 60rem);
  margin     : var(--marquee-height) auto;
  overflow   : scroll;
  --n        : 0.1;
  --i        : 0.1;
  opacity    : 1;
  transition : opacity var(--fast) ease;
}

section p {
  margin     : 0;
}
section.is_loading {
  --accent    : var(--light-grey);
  color       : var(--accent);
}
section.is_loading >>> section,
section.is_loading >>> section p {
  color       : inherit;
  text-align  : center;
}

section.is_error {
  --accent    : var(--error);
  color       : var(--accent);
  font-family : monospace;
}
section.is_error >>> p {
  color       : inherit;
  text-align  : left;
}

</style>
