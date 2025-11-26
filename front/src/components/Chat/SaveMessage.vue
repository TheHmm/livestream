
<script>

import { mapGetters, mapMutations } from 'vuex'
import Links from './Links.vue'
import Reactions from './Reactions/index.vue'


// Chat message

export default {

  name: 'Message',

  components: {
    Links,
    Reactions,
    SaveMessage: this
  },


  // If the chat view mode is set to links only then we only
  // Show messagges with links in them

  props: {
    message    : Object,
    links_only : Boolean,
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

    id()     { return this.message.documentId },
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

    in_response_to() { return this.message.in_response_to && this.message.in_response_to() },

    // received emoji reactions

    received_reactions() { return this.message.Reactions }

  },


}
</script>


<template>
  <article
    :class="[ $id(), { censored, is_response, mine } ]"
    tabindex="0"
    :aria-label="`Message from ${ name }`"
    v-if="links_only ? links : true"
  >

    <SaveMessage
      v-if="in_response_to && !is_response"
      :id="`responded_message_${ in_response_to.documentId }`"
      :message="in_response_to"
      :links_only="links_only"
      :is_response="true"
    />

    <div
      class="header"
      aria-label="Message meta-data"
    > 
      <span class="sender">
        <span
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

    <div 
      v-if="!is_response && !links_only"
    >
      <Reactions 
        :message="message"
        :received_reactions="received_reactions"
      />
    </div>

  </article>
</template>


<style scoped>

.message {
  background-color: var(--back);
  border-radius: var(--radius-s);
  border: var(--solid);
  text-shadow: var(--text-outline);
  max-width           : 100%;
  padding             : 0.5rem;
  margin-top          : 0.5rem;
  pointer-events      : none;
  page-break-before   : auto;
}

.message:not(.is_response) {
  max-width           : calc( 100% - 1rem );
}

.message:first-of-type {
  margin-top          : 0rem;
}

.message .header {
  font-style          : italic;
  font-size           : 0.8rem;
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
  margin-right: auto;

}
.message .body {
  margin-top          : 0.25rem ;
  max-width           : 30rem;
  font-family: var(--font);
}
.message.is_response {
  margin-bottom: 0.5rem;
}
.message.censored .body {
  font-style          : italic;
  font-size           : 0.8rem;
  opacity             : 0.6;
}
.message.mine {
  align-self: flex-end;
}
.message:has(.emoji) {
  margin-bottom: 0.5rem;
}




</style>
