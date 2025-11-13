<script>
import letters from '@/utils/letters.js'
import Letter from './Letter.vue'
import DynamicLogo from './DynamicLogo.vue'
export default { 
  name : 'The Inbetween Banner',
  components : {
    Letter,
    DynamicLogo
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
    <div class="word the">
      <Letter :letter="letters.T" class="T" />
      <Letter :letter="letters.H" class="H" />
      <Letter :letter="letters.E" class="E" />
    </div>
    <!-- Viewers -->
    <DynamicLogo />
    <!-- Viewers -->
    <div class="word imbetween">
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
  </div>
</template>

<style scoped>
#the_inbetween_banner {
  --size:1.2rem;
  --letter-height: calc( 7 * var(--size) );
  --space-width: calc( 3 * var(--size) );
  --full-height: min(10rem, 40vh);
  --full-width: min(100vw);
  --dot-height: calc( var(--full-height) / ( 1.3 * 7 ) );
  --dot-width: calc( var(--full-width) / ( 18 * 7 ) );
  display: flex;
  justify-content: center;
  width: var(--full-width);
  margin-top: 1.5rem;
  z-index: 1;
}
.word {
  display: flex;  
  align-items: stretch;
  filter: 
    drop-shadow( 1px  0px 0px black) 
    drop-shadow(-1px  0px 0px black)
    drop-shadow( 0px  1px 0px black) 
    drop-shadow( 0px -1px 0px black)
  ;
}

.mobile #the_inbetween_banner {
  --size:0.65rem;
  --letter-height: calc( 7 * var(--size) );
  --space-width: calc( 0 * var(--size) );
  --full-height: min(10rem, 60vh);
  --full-width: min(100rem, 100vw);
  --dot-height: calc( var(--full-height) / ( 2.6 * 7 ) );
  --dot-width: calc( var(--full-width) / ( 14 * 7 ) );
  flex-wrap: wrap;
}

</style>

