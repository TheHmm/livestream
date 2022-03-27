<script>
import { mapActions } from 'vuex'
import $log from '@/utils/log'
import Register from './Register.vue'

export default {

  name: 'Input',
  
  components: {
    Register
  },

  data() {
    return {
      message: null,
      request_registration: false,
    }
  },

  methods: {

    ...mapActions( 'viewers', [
      'authenticate'
    ]),
    ...mapActions( 'messages', [
      'create_message'
    ]),

    async send( e ) {
      e.preventDefault()
      console.log(this.message)
      if ( !this.message ) {
        return
      }
      try {
        if ( await this.authenticate() ) {
          await this.create_message( this.message )
          this.message = null
        } else {
          this.request_registration = true
        }
      } catch ( error ) {
        $log.error( 'AUTH', error )
        this.request_registration = true
      }

    }

  }

}
</script>

<template>

  <Register
    v-if="request_registration"
    @close="request_registration = false"
  />
  
  <form 
    id="message_form"
    aria-label="Message form"
    method="post"
    :onsubmit="send"
  >
    <input 
      type="text" 
      name="message" 
      id="message" 
      tabindex="0"
      placeholder ="Type your message and hit enter" 
      v-model.trim="message"
    />
    <input 
      type="submit" 
      title="Send your message to all other viewers."
      value="˃"
    />
  </form>

</template>

<style scoped>

#message_form {
  z-index: 1;
  flex-shrink: 0;
  height: var(--base-height);
  display: flex;
  align-items: center;
  padding: 2px calc( 0.5rem + 2px);
}
#message_form input[type="text"] {
  height: 100%;
  border: none;
  font-size: 1.33rem;
  overflow: scroll;
}


</style>
