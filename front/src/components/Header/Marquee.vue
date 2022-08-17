<script>


// Marquee that changes text based on event name. Animates
// only when the livestream is not 'active'

export default {

  name: 'Marquee',

  computed: {

    default_marquee() {
      return this.$store.getters['meta/default_marquee']
    },

    event() {
      return this.$store.getters[ 'events/get_event' ](
        this.$route.params.slug
      )
    },

    animate() {
      return this.event?.livestream()?.status !== 'active'
    },

    marquee() {
      let marquee = this.default_marquee
      if ( this.event && this.event.marquee ) {
        marquee = this.event.marquee
      }
      return marquee
    },

    text() {
      return this.marquee.repeat(10)
    }

  }
}
</script>


<template>
  <div
    role="marquee"
    :class="[ $id(), { animate } ]"
    :aria-label="`Marquee with title ${ marquee }`"
  >
    <p aria-hidden="true"> {{ text }} </p>
    <p aria-hidden="true"> {{ text }} </p>
  </div>
</template>


<style scoped>

.marquee {
  --back           : var(--black);
  --fore           : var(--white);
  background-color : var(--back);
  box-shadow       : var(--shadow);
  position         : relative;
  white-space      : nowrap;
  overflow         : hidden;
  font-size        : var(--size-m);
  transform        : translateY(-3rem);
  animation        : enter var(--enter) ease 0.1s forwards;
  transition       : background-color var(--very-slow) ease;
  display          : flex;
  align-items      : center;
  height           : var(--marquee-height);
  z-index          : 1;
}
.marquee p {
  margin           : 0;
  padding          : 0 0.25rem;
  transition       : color var(--very-slow) ease;
}
.marquee.animate p {
  animation        : marquee 60s linear infinite;
}

.mobile .marquee {
  font-size        : var(--size-s);
}

#livestream .marquee {
  --back           : var(--yellow);
  --fore           : var(--black);
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
