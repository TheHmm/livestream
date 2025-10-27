<script>
import { mapActions } from 'vuex'


// Message options

export default {

  name: 'Options',


  // Who is the sender and what can they do?

  props: {
    message   : Object,
    sender    : Object,
    moderator : Boolean,
    mine      : Boolean,
    selected  : Boolean,
    is_response: Boolean
  },


  // Message and sender status

  computed: {
    censored() { return this.message?.censored },
    blocked()  { return this.sender?.blocked },
  },


  // Message actions

  methods: {
    ...mapActions( 'messages', [
      'censor_message',
      'delete_message',
      'select_message',
      'unselect_message',
    ]),
    ...mapActions( 'viewers', [
      'block_viewer'
    ]),
    view_message( id ) {
      const original_message = document.getElementById( `original_message_${ id }` )
      if ( original_message ) {
        original_message.scrollIntoView({ behavior: 'smooth' })
        setTimeout( () => { original_message.focus() }, 250 )
      } else {
        console.log( 'original message not found or loaded' )
      }

    }
  }
}
</script>

<template>

  <span 
    v-if="is_response"
    role="menu"
    :class="$id()"
  >
    <span @click="view_message( message.documentId )">
      view
    </span>
  </span>

  <span 
    v-else-if="selected"
    role="menu"
    :class="$id()"
  >
    <span @click="unselect_message( message )">
      cancel
    </span>
  </span>

  <span
    v-else-if="moderator"
    role="menu"
    :class="$id()"
  >
    <span
      @click="censor_message( message )"
      tabindex="0"
    >
      {{ censored && 'uncensor' || 'censor' }}
    </span>
    <span
      @click="block_viewer( sender )"
      tabindex="0"
    >
      {{ blocked && 'unblock' ||  'block' }}
    </span>
    <span
      @click="delete_message( message )"
      tabindex="0"
    >
      delete
    </span>
  </span>
  <span
    v-else-if="mine"
    role="menu"
    class="options"
  >
    <span @click="delete_message( message )">
      delete
    </span>
  </span>
  <span
    v-if="!is_response && !selected"
    role="menu"
    class="options"
  >
    <span @click="select_message( message )">
      reply
    </span>
  </span>
</template>


<style scoped>

.options {
  display         : flex;
  align-items     : center;
  /* margin-left     : auto; */
}
.options span  {
  font-size       : 0.6rem;
  text-decoration : underline;
  cursor          : pointer;
  margin-left: 0.5rem;
}
.options span:first-of-type {
  margin-left: 0;
}
</style>
