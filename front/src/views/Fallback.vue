<script>
import Banner from '@/components/Header/Banner.vue'
import Error from '@/components/Utils/Error.vue'

export default { 

  name:  "Fallback" ,

  components: { 
    Banner,
    Error
  },

  props: {
    message: { type: String }
  },

  computed: {
    is_error() {
     return this.$route.name == 'Error'
    },
  }

}
</script>

<template>

  <main
    :class="{ error: is_error }"
  >
    <Banner />
    <Error 
      v-if="is_error" 
    />
    <section
      v-else
      class="loading"
      v-html="$md( message || '' )"
    />
  </main>

</template>

<style scoped>
main {
  --accent: var(--light-grey);
  position: absolute;
  width: 100%;
}
main.error {
  --accent: hsl(352, 100%, 69%);
  font-family: monospace;
  font-size: 1rem;
}
main #banner {
  margin: 2rem auto;
} 
main section.loading {
  text-align: center;
}
main >>> section {
  background: var(--white);
  max-width: min(70%, 50rem);
  margin: 5rem auto;
  overflow: scroll;
}
main >>> section,
main >>> section p {
  color: var(--accent);
}
</style>
