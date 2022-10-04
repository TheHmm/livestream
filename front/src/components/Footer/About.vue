<script>

// About tab
export default {

  name: 'About',
  computed: {
    about() {
      return this.$store.getters[ 'meta/about' ]
    }
  }

}
</script>


<template>
  <section
    aria-label="About contents"
    v-html="$md( about || '' )"
  />
</template>


<style scoped>

section {
  background     : var(--back);
  padding        : 1rem;
  padding-bottom : 2rem;
  /* height      : var(--full-height); */
  overflow       : scroll;
  transition     : font-size var(--fast) ease-in-out;
  font-size      : 0.8rem;
}
.expanded section {
  font-size      : 2rem;
}

.mobile .expanded section {
  font-size      : 1rem;
}
</style>
