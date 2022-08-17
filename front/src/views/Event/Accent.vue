<script>
import color from '@/utils/color'
export default {
  name : 'AccentPage',
  props : { event: Object },
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
  --accent         : hsl( var(--h), var(--s), var(--l) );
  position         : absolute;
  height           : 100%;
  width            : 100%;
  top              : 0;
  left             : 0;
  background-color : var(--accent);
  z-index          : 5;
}
</style>
