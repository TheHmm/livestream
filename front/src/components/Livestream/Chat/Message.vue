<script>
import { time } from '@/utils'
export default {
  name: 'Message',
  props: {
    message: {
      type: Object
    }
  },
  computed: {
    time() { 
      return time.time_format( this.message.time )
    },
    sender() {
      return this.message.sender.data.name 
    },
    body() { 
      return this.$mdi( this.message.body ) 
    },
  }
}
</script>

<template>
  <div 
    :class="$id()"
    tabindex="0"
    :aria-label="`Message from ${ sender }`"
  >
    <div class="header">
      <span class="sender">{{ sender }}</span>
      <span class="sep"> @ </span>
      <span class="time">{{ time }}</span>
    </div>
    <div 
      class="body"
      v-html="body"
    >
    </div>
  </div>
</template>

<style scoped>
.message {
  --accent: hsl( 
      var(--h), 
      var(--s),
      calc( var(--l) + var(--n) * var(--increment) )
    );
  --back: var(--accent);
  background-color: var(--back);
  padding: 0 0.5rem;
  padding-block-start: 0.5rem;
  padding-block-end: 0.5rem;
  margin: 0.5rem;
  margin-bottom: 0;
}
.message:first-of-type {
  margin-bottom: 0.5rem;
}
.message .header {
  font-family: monospace;
  font-style: italic;
  font-size: 0.8rem;
  opacity: 0.6;
}
.message .header .sep,
.message .header .time {
  margin-right: auto;
  /* opacity: 0.5; */
}
</style>
