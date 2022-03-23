<script>
import { time } from '@/utils'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Message',
  props: {
    message: {
      type: Object
    },
  },
  computed: {
    id() { 
      return this.message.id
    },
    time() { 
      return time.time_format( this.message.time )
    },
    censored() {
      return this.message.censored
    },
    body() { 
      return this.$mdi( this.message.body ) 
    },
    sender() {
      return this.message.sender
    },
    sender_id() {
      return this.sender?.id
    },
    sender_name() {
      return this.sender?.name
    },
    blocked() {
      return this.sender?.blocked
    },
    ...mapGetters( 'viewers', [
      'moderator'
    ] )
  },
  methods: {
    ...mapActions( 'messages', [
      'censor'
    ])
  }
}
</script>

<template>
  <div 
    :class="$id()"
    tabindex="0"
    :aria-label="`Message from ${ sender }`"
  >
    <div 
      class="header"
      aria-label="Message meta-data"
    >
      <!-- <span class="sep"> @ </span> -->
      <span class="time">{{ time }}</span>
      <span class="sender">{{ sender_name }}</span>
      <span
        v-if="moderator"
        class="moderation"
      >
        <span 
          @click="censor( message )"
        > 
          {{ censored && 'uncensor' || 'censor' }} 
        </span>
        <span> delete </span>
        <span> block </span>
      </span>
    </div>
    <div 
      v-html="body"
      class="body"
      aria-label="Message body"
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
  transition: background-color var(--fast) ease;
}
.message:first-of-type {
  margin-top: 0rem;
}
.message .header {
  font-family: monospace;
  font-style: italic;
  font-size: 0.8rem;
  opacity: 0.6;
  display: flex;
}
.message .header .sender {
  margin-left: 0.5rem;
}
.message .header .time {
  margin-right: auto;
  /* opacity: 0.5; */
}
.message .header .moderation {
  display: flex;
  align-items: center;
}
.message .header .moderation span {
  font-size: 0.6rem;
  text-decoration: underline;
  margin-left: 0.5rem;
  cursor: pointer;
}
</style>
