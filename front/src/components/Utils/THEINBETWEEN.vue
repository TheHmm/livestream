<script>
export default { 
  name : 'The Inbetween Banner', 
  mounted() {
    const dots = Array.from( document.querySelectorAll('#the_inbetween_banner .dot.on') )
    dots.forEach( dot => {
      dot.style.setProperty(`--r`, Math.random() * ( 1 - -1 ) + -1 )
      dot.style.setProperty(`--r2`, Math.random() * ( 1 - -1 ) + -1 )
      dot.addEventListener( 'click', e => {
        e.target.classList.add('shaking')
        setTimeout(() => {
          e.target.classList.remove('shaking')
        }, 820)
      })
    })
  }
}
</script>

<style scoped>
#the_inbetween_banner {
  --size:1.2rem;
  --letter-height: calc( 7 * var(--size) );
  --space-width: calc( 3 * var(--size) );
  --full-height: min(10rem, 40vh);
  --full-width: min(80rem, 100vw);
  --dot-height: calc( var(--full-height) / ( 1.3 * 7 ) );
  --dot-width: calc( var(--full-width) / ( 18 * 7 ) );
  display: flex;
  justify-content: center;
  width: var(--full-width);
  margin-inline: auto;
  margin-top: 5rem;
  z-index: 1;
}
.word {
  display: flex;  
  align-items: stretch;
  /* filter: drop-shadow(0 0 0.5px rgb(0, 0, 0)); */
  filter: 
    drop-shadow( 1px  0px 0px black) 
    drop-shadow(-1px  0px 0px black)
    drop-shadow( 0px  1px 0px black) 
    drop-shadow( 0px -1px 0px black);
}
.word.the {
  margin-right: var(--space-width);
}
.word.inbetween {
}
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
  /* scale: 0; */
  animation: blob cubic-bezier(0.36, 0.07, 0.19, 0.97) 2s forwards;
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
  0%  { scale: 0; transform: translate3d(calc( 8rem * var(--r)), calc( 8rem * var(--r2)) , 0); }
  15%  { scale: 1; transform: translate3d(calc( 5rem * var(--r)), calc( 5rem * var(--r2)) , 0); }
  /* 30%  { transform: translate3d(calc( 7rem * var(--r)), calc( 7rem * var(--r2)), 0); } */
  /* 80%  { transform: translate3d(calc( 5rem * var(--r2) * var(--r)), calc( 5rem * var(--r2) * var(--r)), 0); } */
  /* 70%  { transform: translate3d(calc( 1.5rem * ( var(--r2) - var(--r))), calc( 1.5rem * ( var(--r) - var(--r2))), 0); } */
  /* 90%  { transform: translate3d(calc( 1rem * var(--r)), calc( 1rem * var(--r2)), 0); } */
  100% { transform: translate3d(calc( 0rem * var(--r)), calc( 0rem * var(--r2)), 0); }
  /* 100% { transform: translate3d(0, 0, 0); } */
}
.dot.shaking {
  animation        : shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform        : translate3d(0, 0, 0);
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0) }
  20%, 80% { transform: translate3d(2px, 0, 0) }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0) }
  40%, 60% { transform: translate3d(4px, 0, 0) }
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
.mobile .letter {
  margin-right: calc(3* var(--dot-width));
}
</style>

<template>
  <div id="the_inbetween_banner">
    <div class="word the">
      <div class="letter t">
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
      </div>
      <div class="letter h">
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
      </div>
      <div class="letter e">
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">     

          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
      </div>
    </div>
    <div class="word inbetween">
      <div class="letter i">
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
      </div>
      <div class="letter n">
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
      </div>
      <div class="letter b">
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>  
        </div>
        <div class="row">   

          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
        </div>
      </div>
      <div class="letter e">
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>  
        </div>
        <div class="row">   

          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
      </div>
      <div class="letter t">
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
      </div>
      <div class="letter w">
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
        </div>
      </div>
      <div class="letter e">
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>   
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
      </div>
      <div class="letter e">
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>     
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
      </div>
      <div class="letter n">
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
          <div class="dot on"></div>
        </div>
        <div class="row">
          <div class="dot on"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot off"></div>
          <div class="dot on"></div>
        </div>
      </div>
    </div>
  </div>
</template>


