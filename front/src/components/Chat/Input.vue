<script>
import { mapActions, mapMutations, mapGetters, mapState } from 'vuex'
import $log from '@/utils/log'
import Register from './Register.vue'
import Message from './Message.vue'


// Message input area

export default {

  name: 'Input',

  components: {
    Register,
    Message
  },

  props: {
    is_in_past: Boolean
  },


  // Message and registration status

  data() {
    return {
      message: null,
      sending: false,
    }
  },

  computed: {
    ...mapState( 'viewers', [
      'request_registration',
    ]),
    ...mapGetters( 'messages', [
      'selected_message'
    ])
  },

  watch: {
    selected_message() {
      this.$refs.message.focus()
    }
  },


  // When someone tries to send a message we first check if
  // they are authenticated and decide wether to present the
  // regitration form or not.

  methods: {

    ...mapMutations( 'viewers', [
      'set_request_chat_registration'
    ]),
    ...mapActions( 'viewers', [
      'chat_authenticate'
    ]),
    ...mapActions( 'messages', [
      'create_message',
      'unselect_message'
    ]),

    async send( e ) {
      e.preventDefault()
      if ( !this.message ) {
        return
      }
      this.sending = true
      try {
        if ( await this.chat_authenticate() ) {
          await this.create_message( this.message )
          this.message = null
        } else {
          this.set_request_chat_registration( true )
        }
       } catch ( error ) {
        $log.error( 'AUTH', error )
        this.set_request_chat_registration( true )
      }
      if ( this.selected_message ) {
        this.unselect_message( this.selected_message )
      }
      this.sending = false
      setTimeout( () => {
        this.$refs.message.focus()
      }, 100)
    }

  }

}
</script>

<template>

  <Register
    v-if="request_registration"
    @close="set_request_chat_registration( false )"
  />

  <form
    id="message_form"
    aria-label="Message form"
    method="post"
    :onsubmit="send"
  >
  
  <section
    v-if="selected_message"
    class="reply_to"
  >
    <span v-if="selected_message" class="">replying to</span>

    <Message 
      :message="selected_message" 
      :selected="true"
    />
   </section>
    <section class="row">
      <input
        type="text"
        ref="message"
        name="message"
        id="message"
        tabindex="0"
        :disabled="sending || request_registration || is_in_past"
        placeholder ="Type your message and hit enter"
        v-model.trim="message"
      />
      <input
        type="submit"
        class="circle"
        :disabled="sending || request_registration || is_in_past"
        title="Send your message to all other viewers."
        aria-label="Send your message to all other viewers."
        value="˃"
      />
    </section>
  </form>

</template>


<style scoped>

#message_form {
  z-index         : 1;
  flex-shrink     : 0;
  display         : flex;
  flex-direction  : column;
  /* justify-content : stretch; */
  align-items: flex-start;
  padding: 0.5rem;
}
#message_form .reply_to {
  padding         : 0.5rem;
  margin-block: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: right;
  outline          : var(--solid);
  background-color: var(--back);
  border-radius: var(--radius-s);
}
#message_form .reply_to > span {
  font-weight: bold;
  font-size: 0.8rem;
  font-style: italic;
  margin-left: 0.25rem;
  margin-bottom: 0.5rem;

}
#message_form .row {
  width: 100%;
  height          : var(--base-height);
  display         : flex;
  align-items     : center;
  gap:0.5rem  ;
}
#message_form input[type="text"] {
  height          : 100%;
  font-size       : var(--size-m);
  overflow        : scroll;
  padding-inline: 0.5rem;
  width: 100%;
}
#message_form input[type="text"]::placeholder {
  font-size       : 1rem;
}

</style>
