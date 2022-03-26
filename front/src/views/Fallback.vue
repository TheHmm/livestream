<script>
import Banner from '@/components/Header/Banner.vue'
import Error  from '@/components/Utils/Error.vue'


// Fallback components that displayss a loading, error,
// or other type of message. Keeps the Hmmm banner up
// while the App is doing other things

export default { 

  name:  "Fallback",

  components: { 
    Banner,
    Error
  },


  // This component is mounted either manually by passigg
  // it a message or through the router as an error page.

  props: {
    message: { 
      type: String,
      default: ''
    }
  },

  computed: {
    is_error() {
     return this.$route.name == 'Error'
    },
    is_loading() {
      return this.message == 'Loading...'
    }
  }

}
</script>


<template>
  <main :class="{ is_error, is_loading }">
    <Banner />
    <Error v-if="is_error" />
    <section
      v-else
      v-html="$md( message )"
    />
  </main>
</template>


<style scoped>

@import '@/assets/css/fallback.css';  

main.is_loading {
  --accent    : var(--light-grey);
  color       : var(--accent);
}
main.is_loading >>> section,
main.is_loading >>> section p {
  color       : inherit;
  text-align  : center;
}

main.is_error {
  --accent    : var(--error);
  color       : var(--accent);
  font-family : monospace;
}
main.is_error >>> section,
main.is_error >>> section p {
  color       : inherit;
  text-align  : left;
}

</style>
