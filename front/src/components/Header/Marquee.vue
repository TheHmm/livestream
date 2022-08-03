<script>
export default {

  name: 'Marquee',

  computed: {

    default_marquee() {
      return this.$store.getters['meta/default_marquee']
    },
    event() {
      return this.$store.getters[ 'events/get_event' ](
        this
        .$route
        .params
        .slug
      )
    },
    animate() {
      return this.event?.livestream()?.status !== 'active'
    },

    text() {
      let marquee = this.default_marquee
      if ( this.event && this.event.marquee ) {
        marquee = this.event.marquee
      }
      return marquee.repeat(10)
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
