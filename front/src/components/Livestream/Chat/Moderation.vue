<script>

import { mapActions } from 'vuex'

export default {

  name: 'Moderation',

  props: {
    message  : Object,
    sender   : Object,
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
    role="menu"
    class="options"
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
</template>

<style scoped>


</style>
