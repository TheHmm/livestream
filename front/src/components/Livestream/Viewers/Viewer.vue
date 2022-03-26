<script>
import Emo from '../Options/Emoji/Emo.vue'

export default {

  name: 'Viewer',

  components: { 
    Emo 
  },

  props: {
    viewer: Object
  },

  data() {
    return {
      shaking: false,
      showing: false,
    }
  },

  computed: {
    name()  { return this.viewer.name || 'uknown' },
    emoji() { return this.viewer.emoji },
    uuid()  { return this.viewer.uuid },
    n()     { return this.uuid[ this.uuid.length-1 ] }
  },

  methods: {
    shake() {
      this.shaking = true
      setTimeout(() => {
        this.shaking = false
      }, 1500)
    }
  },

  mounted() {
    setTimeout(() => {
      this.showing = true
    }, this.n * 10)
  }

}

</script>

<template>
  <div 
    v-if="showing"
    :title="name"
    :class="[ $id(), 'dot', { shaking, emoji } ]"
    :style="{ '--n': n }"
    tabindex="-1"
    @click="shake"
  >
    <transition name="dot" mode="in-out">
      <Emo
        v-if="emoji"
        :emo="emoji"
      />
    </transition>
  </div>
</template>

<style scoped>

@import '@/assets/css/dot.css';

.viewer {
  position        : relative;
  opacity         : 0.8;
  display         : flex;
  justify-content : center;
  align-items     : center;
}

/* .viewer.dot-move {
  transition: all 0.5s ease;
}
.viewer.dot-leave-active {
  position: absolute;
} */

.viewer.dot-enter-from,
.viewer.dot-leave-to {
  transform: scale(0);
}

.viewer:hover,
.viewer:focus,
.viewer.emoji {
  --shadow-size: 0.5rem;
  opacity: 1;
  z-index: 1;
}

.viewer >>> .emo {
  border-radius: inherit;
  transform: scale(1);
  transition: transform var(--slow) ease;
}

.viewer >>> .emo img {
  border-radius: inherit;
}

.viewer >>> .dot-enter-from,
.viewer >>> .dot-leave-to {
  transform: scale(0);
}

.viewer.emoji {
  transform: scale(2);
  max-width: 10rem;
  max-height: 10rem;
}



</style>
