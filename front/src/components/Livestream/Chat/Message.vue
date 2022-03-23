<script>

import { time } from '@/utils'
import { mapActions, mapGetters } from 'vuex'

export default {

  name: 'Message',

  props: {
    links_only: {
      type: Boolean
    },
    message: {
      type: Object
    },
  },

  computed: {

    id()       { return this.message.id },
    time()     { return time.time_format( this.message.time ) },
    body()     { return this.$mdi( this.message.body ) },
    links()    { return this.message.links },
    censored() { return this.message.censored },
    
    sender()      { return  this.get_viewer_by_id( this.message.sender ) },
    sender_id()   { return this.sender?.id },
    sender_name() { return this.sender?.name },
    blocked()     { return this.sender?.blocked },

    ...mapGetters( 'viewers', [
      'moderator',
      'get_viewer_by_id'
    ] )

  },
  methods: {
    ...mapActions( 'messages', [
      'censor_message',
      'delete_message'
    ]),
    ...mapActions( 'viewers', [
      'block_viewer'
     ] )
  }
}
</script>

<template>
  <article 
    :class="[ 
      $id(), 
      { censored } 
    ]"
    tabindex="0"
    :aria-label="`Message from ${ sender }`"
    v-if="links_only ? links : true"
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
        <span @click="censor_message( message )"> 
          {{ censored && 'uncensor' || 'censor' }} 
        </span>
        <span @click="block_viewer( sender )"> 
          {{ blocked && 'unblock' ||  'block' }}
        </span>
        <span @click="delete_message( message )"> 
          delete 
        </span>
      </span>
    </div>
    <div 
      v-if="!links_only"
      v-html="body"
      class="body"
      aria-label="Message body"
    >
    </div>
    <div
      v-else
      class="body"
      aria-label="Message URLs"
    >
      <ul
        :aria-label="`Links from ${ sender_name }`"
      >
        <li
          v-for="(url, index) in links"
          :key="index"
        >
          <a 
            target="blank"
            :href="url"
            :title="url"
          >{{ url }}</a>
        </li>
      </ul>
    </div>
  </article>
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
  margin-left: auto;
}
.message .header .moderation span {
  font-size: 0.6rem;
  text-decoration: underline;
  margin-left: 0.5rem;
  cursor: pointer;
}

.message .body {
  margin-top: 0.5rem ;
}

.message.censored .body {
  font-style: italic;
  font-size: 0.8rem;
  opacity: 0.6;
}
</style>
