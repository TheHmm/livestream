<script>

import { mapActions } from 'vuex'

export default {

  name: 'Moderation',

  props: {
    message   : Object,
    sender    : Object,
    moderator : Boolean,
    mine      : Boolean,
  },

  computed: {
    censored() { return this.message?.censored },
    blocked()  { return this.sender?.blocked },
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

  <span
    v-if="moderator"
    role="menu"
    class="options"
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


</style>
