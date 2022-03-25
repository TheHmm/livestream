<script>

import { time } from '@/utils'
import { mapActions, mapGetters } from 'vuex'
import Moderation from './Moderation.vue'
import Links from './Links.vue'

export default {
  
  name: 'Message',

  components: { 
    Moderation, 
    Links 
  },

  props: {
    message    : { type: Object },
    links_only : { type: Boolean },
  },

  computed: {

    ...mapGetters( 'viewers', [
      'moderator',
      'uuid',
      'get_viewer_by_id',
    ]),

    id()     { return this.message.id },
    time()   { return time.time_format( this.message.time ) },
    body()   { return this.$mdi( this.message.body || '' ) },
    links()  { return this.message.links },
    sender() { return this.get_viewer_by_id( this.message.sender ) },
    name()   { return this.sender?.name || 'unknown' },
    mine()   { return this.sender?.uuid == this.uuid }

  },

  methods: {
    ...mapActions( 'messages', [
      'delete_message'
    ])
  },

}
</script>

<template>
  <article 
    :class="[ 
      $id(), 
      { censored: message.censored } 
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
      <span class="sender">{{ name }}</span>
      <Moderation
        v-if="moderator"
        :message="message"
        :sender="sender"
      />
      <span
        v-if="mine"
        role="menu"
        class="options"
      >
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
    <Links
      v-else
      :links="links"
      :name="name"
    />

  </article>
</template>

<style scoped>

.message {
  --increment: 4%;
  --accent: hsl( 
      var(--h), 
      var(--s),
      min( calc( var(--l) + var(--n) * var(--increment) ), 98% )
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

.message .body {
  margin-top: 0.25rem ;
}

.message >>> .options {
  display: flex;
  align-items: center;
  margin-left: auto;
}
.message >>> .options span {
  font-size: 0.6rem;
  text-decoration: underline;
  margin-left: 0.5rem;
  cursor: pointer;
}
.message.censored .body {
  font-style: italic;
  font-size: 0.8rem;
  opacity: 0.6;
}
</style>
