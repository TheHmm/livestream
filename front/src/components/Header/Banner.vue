<script>
import letters from '@/utils/letters.js'
import Letter from './Letter.vue'
import DynamicLogo from './DynamicLogo.vue'
import Viewers from '../Viewers/index.vue'
export default { 
  name : 'The Inbetween Banner',
  components : {
    Letter,
    DynamicLogo,
    Viewers
  },
  data() {
    return {
      letters
    }
  },
}
</script>

<template>
  <div id="the_inbetween_banner">
    <Letter :letter="letters.T" class="T" />
    <Letter :letter="letters.H" class="H" />
    <Letter :letter="letters.E" class="E" />
    <DynamicLogo />
    <Viewers />
    <Letter :letter="letters.I" class="I" />
    <Letter :letter="letters.N" class="N" />
    <Letter :letter="letters.B" class="B" />
    <Letter :letter="letters.E" class="E" />
    <Letter :letter="letters.T" class="T" />
    <Letter :letter="letters.W" class="W" />
    <Letter :letter="letters.E" class="E" />
    <Letter :letter="letters.E" class="E" />
    <Letter :letter="letters.N" class="N" />
  </div>
</template>

<style scoped>
#the_inbetween_banner {
  --letter-height: calc( 7 * var(--dot-height) );
  --full-height: calc( 0.95 * var(--letter-height) + 2 * var(--padding) );
  --full-width: 100vw;
  max-width: var(--full-width);
  min-height: calc( 0.6 * var(--letter-height) + 2 * var(--padding) );
  width: 100%;
  padding: var(--padding);
  padding-right: calc( var(--padding) + var(--size) / 2 );
  display: flex;
  justify-content: center;
}
.mobile #the_inbetween_banner {
  --size:0.65rem;
  --letter-height: calc( 7 * var(--size) );
  --full-height: min(10rem, 60vh);
  --full-width: min(100rem, 100vw);
  --dot-height: calc( var(--full-height) / ( 2.6 * 7 ) );
  --dot-width: calc( var(--full-width) / ( 14 * 7 ) );
  flex-wrap: wrap;
}

</style>

