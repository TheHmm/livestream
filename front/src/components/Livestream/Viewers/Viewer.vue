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
  --n: 1;
  --back: var(--accent-light);
  --shadow-size: 1rem;
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--back);
  box-shadow: 0 0 var(--shadow-size) 0 var(--shadow-color);
  border-radius: 30rem;
  opacity: 0.8;
  transition: 
    box-shadow var(--fast) ease,
    opacity var(--fast) ease
  ;
  animation: dot_enter var(--enter) ease calc( var(--n) *  0.1s) forwards;
  transform: scale(0);
  transform-origin: center center;
}
.viewer:hover,
.viewer:focus {
  --shadow-size: 0.5rem;
  opacity: 1;
}

@keyframes dot_enter {
  from { transform: scale(0); }
  to { transform: scale(1); }
}
</style>
