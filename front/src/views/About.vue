<script>
import { mapState } from 'vuex'

export default {

  name: 'AboutPage',
  computed: {
    ...mapState([
      'meta'
    ])
  }

}
</script>


<template>
  <main 
    :id="$id()"
    aria-labelledby="about_label"
  >
    <h2 id="about_label">About</h2>
    <p> {{ meta.about }} </p>
  </main>
</template>

<style>
</style>
