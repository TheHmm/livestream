<script>

import { mapGetters, mapMutations } from 'vuex'
import Options from './Options.vue'
import Links from './Links.vue'


// Chat message

export default {

  name: 'Message',

  components: {
    Options,
    Links,
    Message: this
  },


  // If the chat view mode is set to links only then we only
  // Show messages with links in them

  props: {
    message    : Object,
    links_only : Boolean,
    selected   : Boolean,
    is_response: Boolean,
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
    time_l() { return this.$time.long_date_format( this.time ) },
    body()   { return this.$mdi( this.message.body || '' ) },
    links()  { return this.message.links },
    censored()  { return this.message.censored },


    // We always get the sender details from the store since
    // The message only has an id in it.

    sender() { return this.message.sender() },
    name()   { return this.sender?.name || 'unknown' },
    mine()   { return this.sender?.uuid == this.uuid },

    // if message is a resposnse to another message

    in_response_to() { return this.message.in_response_to && this.message.in_response_to() }

  },

  methods: {
    ...mapMutations( 'viewers', [
      'set_request_registration'
    ]),
  }

}
</script>


<template>
  <article
    :class="[ $id(), { censored, selected, is_response, mine } ]"
    tabindex="0"
    :aria-label="`Message from ${ name }`"
    v-if="links_only ? links : true"
  >

    <Message
      v-if="in_response_to && !selected && !is_response"
      :id="`responded_message_${ in_response_to.id }`"
      :message="in_response_to"
      :links_only="links_only"
      :is_response="true"
    />

    <div
      class="header"
      aria-label="Message meta-data"
    > 
      <span
        class="sender"
      >
        <u
          v-if="mine"
          :title="'Edit ' + name"
          @click="set_request_registration( true )"
        >
          {{ name }}
        </u>
        <span
          v-else
          :title="name"
        >
          {{ name }}
        </span>
      </span>
      <time
        class="time"
        :datetime="time"
        :title="time_l"
      >
        {{ time_s }}
      </time>
      <Options
        :moderator="moderator"
        :mine="mine"
        :message="message"
        :sender="sender"
        :selected="selected"
        :is_response="is_response"
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
  /* margin              : 2px; */
  padding             : 0.5rem;
  margin-top          : 0.5rem;
  pointer-events      : none;
  transition          : background-color var(--fast) ease;
}

.message:not(.message.is_response) {
  max-width           : calc( 100% - 1rem );
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
  white-space         : nowrap;
  overflow            : hidden;
  text-overflow       : ellipsis;
  font-style: normal;
}
.message .header .sender u {
  cursor              : pointer;
}

.message .header .time {
  font-size: 0.8rem;
  /* margin-left         : 0.5rem; */
  /* margin-right        : auto; */
  margin-right: auto;

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

.message.mine {
  align-self: flex-end;
}

.message.selected {
  --back : var(--accent-lighter);
}

.message.is_response {
  --back : var(--accent-lighter);
  
}



</style>
