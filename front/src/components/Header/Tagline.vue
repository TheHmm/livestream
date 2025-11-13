<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Tagline',
  computed: {
    ...mapGetters( 'meta', [ 'tagline' ]),
    ...mapGetters( 'livestream', [ 'current_livestream' ]),
    animate() {
      return this.current_livestream?.status !== 'active'
    },
  }
}
</script>

<template>
  <div 
    :id="$id()"
    v-if="tagline"
    :class="[ 'text-ring', { animate } ]" 
    :style="{ 
      '--total': tagline.length,
      '--radius': 1 / Math.sin( ( 360 / tagline.length ) / (180 / Math.PI))
    }"
  >
    <div aria-hidden="true">
      <span 
        v-for="(letter, i) in tagline" 
        :style="{ '--index': i }"
      >
        {{ letter }}
      </span>
    </div>
    <span class="sr-only">{{ tagline }}</span>
  </div>
</template>

<style scoped>
.text-ring {
  position: relative;
  top: calc( 1ch * var(--radius) - 1.5ch );
  left: -2ch;
  /* min-height: calc( 2 * 1ch * var(--radius) - 0ch ); */
  min-width: calc( 2 * 1ch * var(--radius) - 0ch );
  animation: spin 18s linear 0s infinite;
}
.text-ring [style*=--index] {
  font-weight: bold;
  font-style: italic;
  font-family: monospace;
  text-transform: uppercase;
  font-size: smaller;
  padding-left: 1ch;
  position: absolute;
  top: 50%;
  left: 50%;
  transform:
    translate(-50%, -50%)
    rotate(calc(360deg / var(--total) * var(--index)))
    translateY(calc(var(--radius, 5) * -1ch));
}
.text-ring .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
@keyframes spin {
  to { rotate: -360deg; }
}
</style>
