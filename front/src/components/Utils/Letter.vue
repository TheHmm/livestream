<script>
export default {
  name: 'Letter',
  props: [ 'letter' ],
  methods: {
    shake( e ) {
      e.target.classList.add('shaking')
      setTimeout(() => {
        e.target.classList.remove('shaking')
      }, 820)
    }
  }
}
</script>

<template>
  <div class="letter">
    <div 
      v-for="row in letter.split(/\n/)" 
      class="row"
    > 
      <div
        v-for="dot in row" 
        :class="[ 'dot', dot == ' ' ? 'off' : 'on' ]"
        :style="{ 
          '--r': Math.random() * ( 1 - -1 ) + -1,
          '--r2': Math.random() * ( 1 - -1 ) + -1
        }"
        @click="shake"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.letter {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  align-items: stretch;
  height: var(--letter-height);
  overflow: visible;
  margin-right: calc(2 * var(--dot-width));
}
.letter .row {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
}
.dot {
  height: var(--dot-height);
  min-width: var(--dot-width);
  flex-grow: 1;
  width: 100%;
}
.dot::after {
  content: '';
  display: block;
  position: absolute;
  border-radius: 30rem;
  top: calc( -0.5 * var(--dot-height));
  left: calc( -0.5 * var(--dot-width) - 0.25rem);
  min-width: calc( 1 * var(--size));
  min-height: calc( 1 * var(--size));
  background-color: var(--accent);
  transition: background-color var(--fast) linear ;
  animation: blob cubic-bezier(0.36, 0.07, 0.19, 0.97) 1s forwards;
}
dot:hover::after {
  scale: calc( 1.5 * var(--r) );
}
.dot.on::after {
  opacity: 1;
}
.dot.off::after {
  opacity: 0;
}
@keyframes blob {
  0%  { scale: 0; transform: translate3d(calc( 6rem * var(--r)), calc( 6rem * var(--r2)) , 0); }
  15%  { scale: 1; transform: translate3d(calc( 3rem * var(--r)), calc( 3rem * var(--r2)) , 0); }
  /* 30%  { transform: translate3d(calc( 7rem * var(--r)), calc( 7rem * var(--r2)), 0); } */
  /* 80%  { transform: translate3d(calc( 5rem * var(--r2) * var(--r)), calc( 5rem * var(--r2) * var(--r)), 0); } */
  /* 70%  { transform: translate3d(calc( 1.5rem * ( var(--r2) - var(--r))), calc( 1.5rem * ( var(--r) - var(--r2))), 0); } */
  /* 90%  { transform: translate3d(calc( 1rem * var(--r)), calc( 1rem * var(--r2)), 0); } */
  100% { transform: translate3d(calc( 0rem * var(--r)), calc( 0rem * var(--r2)), 0); }
  /* 100% { transform: translate3d(0, 0, 0); } */
}
.dot.shaking {
  animation : shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform : translate3d(0, 0, 0);
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0) }
  20%, 80% { transform: translate3d(2px, 0, 0) }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0) }
  40%, 60% { transform: translate3d(4px, 0, 0) }
}
.mobile .letter {
  margin-right: calc(3* var(--dot-width));
}
</style>
