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
      'delete_message'
    ]),
    ...mapActions( 'viewers', [
      'block_viewer'
     ] )
  }
}
</script>

<template>

  <span
    v-if="moderator"
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
</template>


<style scoped>

.options {
  display         : flex;
  align-items     : center;
  margin-left     : auto;
}
.options span {
  font-size       : 0.6rem;
  text-decoration : underline;
  margin-left     : 0.5rem;
  cursor          : pointer;
}

</style>
