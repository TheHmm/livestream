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
  <div class="letter" @click="$router.push('/')">
    <div 
      v-for="( row, i) in letter.split(/\n/).slice(1,8)" 
      class="row"
      :style="{ '--n': i + 1 }"
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
  flex: 1;
  width: 100%;
  min-width: 1.2rem;
  display: flex;
  flex-direction: column;
  overflow: visible;
  filter: 
    drop-shadow( 1px  0px 0px var(--fore)) 
    drop-shadow(-1px  0px 0px var(--fore))
    drop-shadow( 0px  1px 0px var(--fore)) 
    drop-shadow( 0px -1px 0px var(--fore))
  ;
  margin-right: var(--gap);
}
.letter:last-of-type {
  margin-right: unset;
}
.letter .row {
  /* height: 100%; */
  /* position: sticky; */
  /* top: calc( 0.4 * var(--n) * var(--dot-height) ); */
  width: 100%;
  display: flex;
}

.dot {
  max-height: var(--dot-height);
  /* max-height: calc( 0.9 * var(--dot-height)); */
  max-width: var(--dot-width);
  width: 100%;
  height: var(--dot-height);
  /* background-color: red; */
}
.dot::after {
  content: '';
  display: block;
  position: absolute;
  top: 0; left: 0;
  /* top: calc( -0.5 * var(--dot-height)); */
  /* left: calc( -0.5 * var(--dot-width) - 0.25rem); */
  min-width: calc( 1 * var(--size));
  min-height: calc( 1 * var(--size));
  border-radius: 30rem;
  background-color: var(--fore);
  color: var(--back);
  transition: background-color var(--fast) linear ;
  /* animation: blob cubic-bezier(0.36, 0.07, 0.19, 0.97) 1s forwards; */
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
  min-width: 0.4rem;
  /* margin-right: calc(3* var(--dot-width)); */
}

#livestream .dot::after {
  background-color: var(--accent);
}

</style>
