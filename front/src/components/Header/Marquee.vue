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

    slug() {
      return this.event?.slug
    },

    animate() {
      return this.$store.getters[ 'livestream/current_livestream' ] ?.status !== 'active'
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
    },

  },


  data() {
    return {
      hidden: true,
    }
  },

  mounted() {
    this.hidden = false
  },

  watch: {
    slug() {
      this.hidden = true
      setTimeout( () => {
        this.hidden = false
      }, 1000 )
    }
  }

}
</script>


<template>
  <div
    role="marquee"
    :class="[ $id(), { animate, hidden } ]"
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
  transform        : translateY(0rem);
  display          : flex;
  align-items      : center;
  height           : var(--marquee-height);
  z-index          : 1;
  transition       :
    background-color var(--very-slow) ease,
    transform var(--enter) ease
  ;
}
.marquee.hidden {
  transform        : translateY(-3rem);
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

</style>
