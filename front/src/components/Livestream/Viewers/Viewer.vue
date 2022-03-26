<script>
import Emo from '../Options/Emoji/Emo.vue'

export default {
  components: { Emo },
  name: 'Viewer',
  props: {
    viewer: {
      type: Object
    }
  },
  data() {
    return {
      shaking: false
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
  }
}

</script>

<template>
  <div 
    :title="name"
    :class="[ $id(), { shaking, emoji } ]"
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

.viewer {
  --n: 1;
  --back: var(--accent-light);
  --shadow-size: 1rem;
  background-color: var(--back);
  box-shadow: 0 0 var(--shadow-size) 0 var(--shadow-color);
  min-width: 1.5rem;
  min-height: 1.5rem;
  max-width: 1.5rem;
  max-height: 1.5rem;
  border-radius: 30rem;
  opacity: 0.8;
  transform: scale(0);
  transition: 
    box-shadow var(--fast) ease,
    opacity var(--fast) ease,
    transform var(--slow) ease,
    max-width var(--slow) ease,
    max-height var(--slow) ease
  ;
  animation: dot_enter var(--enter) ease calc( var(--n) *  0.1s) forwards;
  transform-origin: center center;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.viewer:hover,
.viewer:focus,
.viewer.emoji {
  --shadow-size: 0.5rem;
  opacity: 1;
}

.viewer >>> .emo {
  border-radius: inherit;
  transform: scale(1);
  transition: transform var(--slow) ease;
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

.viewer.shaking {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes dot_enter {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0) }
  20%, 80% { transform: translate3d(2px, 0, 0) }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0) }
  40%, 60% { transform: translate3d(4px, 0, 0) }
}


</style>
