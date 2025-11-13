<script>
import Tagline from './Tagline.vue';

export default {
  name: 'DynamicLogo',
  components: {
    Tagline,
  },
  computed: {
  }
}
</script>

<template>
  <div :id="$id()">
    <!-- Organisation Logo -->
    <Tagline /> 
  </div>
</template>

<style scoped>
</style>
