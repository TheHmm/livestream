<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Docs',
  data() {
    return {
      toc: [],
    }
  },
  computed: {
    ...mapGetters( 'meta', [ 'docs' ]),
    docs_html() { return this.$md( this.docs ) }
  },
  mounted() {
    this.set_toc()
  },
  watch: {
    docs_html() {
      this.set_toc()
    }
  }, 
  methods: {
    set_toc() {
      setTimeout(() => {        
        this.toc = Array.from(document.querySelectorAll('h2')).map( e => ({ id: e.id, text: e.innerHTML }) )
      }, 100)
    }
  }
}
</script>
<template>
  <section :id="$id()">
    <h1>Documentation</h1>
    <ul class="toc">
      <li v-for="({id, text}) in toc" >
        <a :href="`#${ id }`">{{ text }}</a>
      </li>
    </ul>
    <section v-html="docs_html" />
  </section>
</template>
<style scoped>
#docs * {
  max-width: 100%;
}
#docs:deep(h2) {
  scroll-margin-top: calc( 2rem + var(--header-height));
}
</style>