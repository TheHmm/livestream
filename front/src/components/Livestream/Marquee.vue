
<script>
export default {
  name: 'Marquee',
  props: {
    marquee: { 
      type: String
    },
    animate: { 
      type: Boolean,
      default: true
    }
  },
  computed: {
    default_marquee() { 
      return this.$store.getters.default_marquee 
    },
    text() {
      return ( 
        this.marquee || 
        this.default_marquee 
      )
      .repeat(10)
    }
  }
}
</script>

<template>
  <div
    :class="[ $id(), { animate } ]"
    role="marquee"
    aria-label="marquee with event title"
  >
    <p> {{ text }} </p>
    <p> {{ text }} </p>
  </div>
</template>

<style scoped>
.marquee {
  box-shadow: var(--shadow-down);
  white-space: nowrap;
  overflow: hidden;
  --back: var(--yellow);
  z-index: 3;
  flex-shrink: 0;
}
.marquee p {
  background-color: var(--back);
  display: inline-block;
  margin: 0;
  padding: 0.3rem 0;
}
.marquee.animate p {
  animation: marquee 60s linear infinite;
}
@keyframes marquee {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(-100%, 0); }
}


.reduce_motion .marquee p {
  animation: none;
}
</style>
