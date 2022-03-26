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
    name() { return this.viewer.name || 'uknown' },
    emoji() { return this.viewer.emoji }
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
    :class="[ $id(), { shaking } ]"
    :title="name"
    tabindex="-1"
    @click="shake"
  >
    <Emo
      v-if="emoji"
      :emo="emoji"
    />
  </div>
</template>

<style scoped>

.viewer {
  --n: 1;
  --back: var(--accent-light);
  --shadow-size: 1rem;
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--back);
  box-shadow: 0 0 var(--shadow-size) 0 var(--shadow-color);
  border-radius: 30rem;
  opacity: 0.8;
  transition: 
    box-shadow var(--fast) ease,
    opacity var(--fast) ease,
    transform var(--slow) ease
  ;
  /* animation: dot_enter var(--enter) ease calc( var(--n) *  0.1s) forwards; */
  /* transition: all var(--slow) ease; */
  transform: scale(1);
  transform-origin: center center;
}
.viewer:hover,
.viewer:focus {
  --shadow-size: 0.5rem;
  opacity: 1;
}

@keyframes dot_enter {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.shaking {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0) }
  20%, 80% { transform: translate3d(2px, 0, 0) }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0) }
  40%, 60% { transform: translate3d(4px, 0, 0) }
}

</style>
