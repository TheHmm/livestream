<script>
export default {
  name: 'Viewer',
  props: {
    viewer: {
      type: Object
    }
  }
}
</script>

<template>
  <div 
    :class="$id()"
    :title="viewer.name"
    tabindex="-1"
  >
  </div>
</template>

<style scoped>

.viewer {
  --back: var(--light-grey);
  --shadow-size: 1rem;
  width: 1rem;
  height: 1rem;
  background-color: var(--back);
  box-shadow: 0 0 var(--shadow-size) 0 var(--shadow-color);
  border-radius: 30rem;
  opacity: 0.8;
  transition: 
    box-shadow var(--fast) ease,
    opacity var(--fast) ease
  ;
}
.viewer:hover,
.viewer:focus {
  --shadow-size: 0.5rem;
  opacity: 1;
}
</style>
