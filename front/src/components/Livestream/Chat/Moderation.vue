<script>

import { mapActions } from 'vuex'

export default {

  name: 'Moderation',

  props: {
    message  : { type: Object },
    sender   : { type: Object },
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
    :class="$id()"
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

.moderation {
  display: flex;
  align-items: center;
  margin-left: auto;
}
.moderation span {
  font-size: 0.6rem;
  text-decoration: underline;
  margin-left: 0.5rem;
  cursor: pointer;
}

</style>
