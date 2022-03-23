<script>
import { mapActions } from 'vuex'
import { logger } from '@/utils'
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

  computed: {



  },

  async created() {
    
    

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
      try {
        if ( await this.authenticate() ) {
          try {
            await this.create_message( this.message )
          } catch ( error ) {
            console.error(error)
          }
        } else {
          this.request_registration = true
        }
      } catch ( error ) {
        logger.error( 'AUTH', error )
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
      placeholder ="type your message and hit enter" 
      v-model="message"
    />
      <input 
        type="submit" 
        title="Send your message to all other viewers."
        value="Send"
      />
  </form>

</template>

<style scoped>

#message_form {
  display: flex;
}
#message_form input[type="text"] {
  flex-grow: 1;
  min-width: 100%;
  height: 2rem;
}
#message_form input[type="submit"] {
  margin: 0.5rem;
  height: 100%;
}

</style>
