<script>

import Options from './Options/index.vue'
import Network from './Network.vue'

export default {
  name: 'Footer',
  props: {
    desired_tabs: { type: Array }
  },
  components: {
    Options,
    Network,
  },
}
</script>


<template>
  <footer
    aria-label="options & network statistics."
  >
    <Options
      :desired_tabs="desired_tabs"
    />
    <Network />
  </footer>
</template>


<style scoped>

footer {
  max-height       : var(--footer-height);
  position         : fixed;
  bottom           : 0;
  width            : 100%;
  max-width        : calc( var(--main-width) - 1rem );
  padding          : 0 var(--size-s);
  display          : flex;
  align-items      : flex-end;
  z-index          : 2;
}

footer >>> #network {
  margin           : 0.2rem var(--size-s);
  margin-right     : auto;
}



.mobile footer {
  padding          : 0;
  flex-direction   : row-reverse;
  flex-wrap        : wrap;
  max-width        : unset;
}

.mobile footer {
  flex-direction   : column-reverse;
}


</style>
