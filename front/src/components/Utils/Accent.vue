
<script>
import color from '@/utils/color'

export default {

  name: 'Accent',

  props: {
    event: Object
  },

  computed: {
    vars() {
      return color.route_to_css_vars( this.$route )
    },
  }
}
</script>

<template>
  <div :style="vars" />
</template>


<style scoped>
div {
  --accent: hsl( var(--h), var(--s), var(--l) );
  height: 100%;
  width: 100%;
  background-color: var(--accent);
  z-index: 5;
}
</style>
