<script>

import { mapGetters } from 'vuex'
import Options from './Options.vue'
import Links from './Links.vue'


// Chat message

export default {
  
  name: 'Message',

  components: { 
    Options, 
    Links 
  },


  // If the chat view mode is set to links only then we only
  // Show messagges with links in them

  props: {
    message    : Object,
    links_only : Boolean,
  },

  computed: {


    // Some computed properties that decide what actions a  
    // user has access to for each message

    ...mapGetters( 'viewers', [
      'uuid',
      'moderator',
    ]),


    // Basic message details.

    id()     { return this.message.id },
    time()   { return this.message.time },
    time_s() { return this.$time.time_format( this.time ) },
    time_l() { return this.$time.date_format( this.time ) },
    body()   { return this.$mdi( this.message.body || '' ) },
    links()  { return this.message.links },


    // We always get the sender details from the store since
    // The message only has an id in it.

    sender() { return this.message.sender },
    name()   { return this.sender?.name || 'unknown' },
    mine()   { return this.sender?.uuid == this.uuid }

  },

}
</script>


<template>
  <article 
    :class="[ $id(), { censored: message.censored } ]"
    tabindex="0"
    :aria-label="`Message from ${ sender }`"
    v-if="links_only ? links : true"
  >

    <div 
      class="header"
      aria-label="Message meta-data"
    >
      <time 
        class="time"
        :datetime="time"
        :title="time_l"
      >
        {{ time_s }}
      </time>
      <span 
        class="sender"
        :title="name"
      >
        {{ name }}
      </span>
      <Options
        :moderator="moderator"
        :mine="mine"
        :message="message"
        :sender="sender"
      />
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
  --increment         : 4%;
  --accent            : hsl(
      var(--h), 
      var(--s),
      min( 
        calc( var(--l) + var(--n) * var(--increment) ), 
        calc( var(--max-l) - var(--increment)) 
      ) );
  --back              : var(--accent);
  background-color    : var(--back);
  max-width           : 100%;
  margin              : 2px;
  padding             : 0.5rem 0.5rem;
  margin-top          : 0.5rem;
  pointer-events      : none;
  transition          : background-color var(--fast) ease;
}

.message:first-of-type {
  margin-top          : 0rem;
}

.message .header {
  font-family         : monospace;
  font-family         : 'not-courier-sans', monospace;
  font-style          : italic;
  font-size           : 0.9rem;
  display             : flex;
  gap                 : 0.5rem;
  align-items         : center;
  width               : 100%;
  overflow            : hidden;
}

.message .header .sender {
  margin-left         : 0.5rem;
  white-space         : nowrap;
  overflow            : hidden;
  text-overflow       : ellipsis;
}

.message .header .time {
  margin-right        : auto;
}

.message .body {
  margin-top          : 0.25rem ;
  max-width           : 30rem;
}

.message .body >>> a {
  word-break: break-all;
}

.expanded .message {
  pointer-events      : all;
}

.message.censored .body {
  font-style          : italic;
  font-size           : 0.8rem;
  opacity             : 0.6;
}



</style>
