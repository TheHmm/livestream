<script>
import { mapState } from 'vuex'

export default {

  name: 'About',
  computed: {
    ...mapState([
      'meta'
    ])
  }

}
</script>


<template>
  <div class="about">
    <h2>About</h2>
    <h3> {{ meta.about }} </h3>
  </div>
</template>

<style>
</style>
