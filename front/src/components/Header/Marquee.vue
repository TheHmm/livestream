<script>
export default {

  name: 'Marquee',

  props: {
    marquee: { type: String },
    animate: { type: Boolean, default: true }
  },

  computed: {

    default_marquee() { 
      return this.$store.getters.default_marquee 
    },

    text() {
      return ( 
        this.marquee || 
        this.default_marquee 
      ).repeat(10)
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
  box-shadow       : var(--shadow);
  --back           : var(--yellow);
  background-color : var(--back);
  white-space      : nowrap;
  overflow         : hidden;
  font-size        : 1.33rem;
  transform        : translateY(-3rem);
  animation        : enter var(--enter) ease 0.1s forwards;
  display          : flex;
  align-items      : center;
}
.marquee p {
  margin           : 0;
  padding          : 0 0.25rem;
}
.marquee.animate p {
  animation        : marquee 60s linear infinite;
}
@keyframes marquee {
  from { transform : translate(0, 0); }
  to   { transform : translate(-100%, 0); }
}

@keyframes enter {
  from { transform : translateY(-3rem) }
  to   { transform : translateY(0) }
}

</style>
