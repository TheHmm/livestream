<script>
import Emo from '../../Footer/Emoji/Emo.vue'


// Viewer dot, will mount an emoji if a user has made that
// reaction.

export default {

  name: 'Viewer',
  components: { Emo },
  props: { viewer: Object },


  // Clicking on a dot will make it shake

  data() {
    return {
      shaking: false,
    }
  },


  // Basic viewer properties

  computed: {
    uuid()  { return this.viewer.uuid },
    name()  { return this.viewer.name || 'unnamed viewer' },
    is_me() { return this.$store.getters['viewers/is_me']( this.viewer ) },
    nick()  { return this.is_me && this.name + ' (you)' || this.name },
    emoji() { return this.viewer.emoji },
    n()     { return this.uuid[ this.uuid.length-1 ] },
  },

  methods: {
    shake() {
      this.shaking = true
      setTimeout(() => {
        this.shaking = false
      }, 1500)
    }
  },

}

</script>

<template>
  <div
    :title="nick"
    :class="[ $id(), 'dot', { shaking, emoji } ]"
    :style="{ '--n': n }"
    :aria-label="`Dot for viewer ${ name }`"
    tabindex="-1"
    @click="shake"
  >
    <transition name="dot" mode="in-out">
      <Emo
        v-if="emoji"
        :emo="emoji"
        :aria-label="`Emoji from viewer ${ name }`"
      />
    </transition>
  </div>
</template>

<style scoped>

@import '@/assets/css/dot.css';

.viewer {
  --fore          : var(--accent-lighter);
  --back          : var(--accent-light);
  position        : relative;
  opacity         : 0.8;
  display         : flex;
  justify-content : center;
  align-items     : center;
  margin-left     : calc( var(--n) * var(--size-s));
  /* transform       : scale(1); */
  scale: 1;
  transition      : all var(--slow) ease;
}

.viewer.dot-enter-active,
.viewer.dot-leave-active,
.viewer.dot-move {
  transition      : all var(--slow) ease;
}
.dot-enter-to,
.dot-leave-from {

}
.dot-enter-from,
.dot-leave-to {
  /* transform       : scale(0); */
  scale: 0;
  /* transition      : all var(--slow) ease; */
}
.viewer.dot-leave-active {
  position        : absolute;
}

.viewer:hover,
.viewer:focus,
.viewer.emoji {
  --shadow-size   : 0.5rem;
  opacity         : 1;
  z-index         : 1;
}

.viewer >>> .emo {
  --fore          : var(--black);
  border-radius   : inherit;
  transform       : scale(1);
  transition      : transform var(--slow) ease;
}

.viewer >>> .emo img {
  border-radius   : inherit;
}
.viewer >>> .dot-enter-from,
.viewer >>> .dot-leave-to {
  /* transform       : scale(0); */
}

.viewer.emoji {
  transform       : scale(2);
  max-width       : 10rem;
  max-height      : 10rem;
}



</style>
