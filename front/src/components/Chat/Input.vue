<script>
import { mapActions } from 'vuex'
import $log from '@/utils/log'
import Register from './Register.vue'


// Message input area

export default {

  name: 'Input',
  
  components: {
    Register
  },


  // Message and registration status

  data() {
    return {
      message: null,
      request_registration: false,
      sending: false,
    }
  },


  // When someone tries to send a message we first check if 
  // they are authenticated and decide wether to present the
  // regitration form or not.

  methods: {

    ...mapActions( 'viewers', [
      'authenticate'
    ]),
    ...mapActions( 'messages', [
      'create_message'
    ]),

    async send( e ) {
      e.preventDefault()
      if ( !this.message ) {
        return
      }
      this.sending = true
      try {
        if ( await this.authenticate() ) {
          await this.create_message( this.message )
          this.message = null
        } else {
          this.request_registration = true
        }
        this.sending = false
      } catch ( error ) {
        $log.error( 'AUTH', error )
        this.request_registration = true
        this.sending = false
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
      :disabled="sending || request_registration"
      placeholder ="Type your message and hit enter" 
      v-model.trim="message"
    />
    <input 
      type="submit" 
      class="circle"
      :disabled="sending || request_registration"
      title="Send your message to all other viewers."
      value="˃"
    />
  </form>

</template>


<style scoped>

#message_form {
  z-index         : 1;
  flex-shrink     : 0;
  height          : var(--base-height);
  display         : flex;
  justify-content : stretch;
  align-items     : center;
  padding         : 2px calc( 0.5rem + 2px);
}
#message_form input[type="text"] {
  flex-grow       : 1;
  height          : 100%;
  border          : none;
  font-size       : var(--size-m);
  overflow        : scroll;
  margin-right    : 0.5rem;
}
#message_form input[type="text"]::placeholder {
  font-size       : 1.15rem;
}

</style>
