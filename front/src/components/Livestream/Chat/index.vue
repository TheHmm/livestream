<script>
import { mapGetters } from 'vuex'
import Message from './Message.vue'

export default {

  name: 'Chat',
  
  components: {
    Message
  },

  data() {
    return {
      expanded: false,
      message: null
    }
  },

  computed: {

    ...mapGetters( 'messages', [ 
      'messages_array',
    ]),

  },

  methods: {

    send( e ) {
      console.log(e)
    }

  }

}
</script>

<template>
  <div 
    id="chat_container"
    aria-label="chat"
  >

    <div
      :id="$id()"
      :class="[ 'tab', { expanded } ]"
      tabindex="0"
      @click="expanded = true"
    >

      <label 
        class="title"
        :for="$id()"
      > 
        <div
          v-if="expanded"
          class="options"
        >
          <input 
            value="close"
            class="close"
            name="close"
            type="button"
            @click.stop="expanded = false"
          />
        </div>
        <span v-else>Chat</span>
      </label>

      <div class="contents">
        
        <form 
          id="message_form"
          aria-label="Message form"
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

        <Message
          v-for="( message, index ) in messages_array"
          :key="index"
          :style="{ '--n': index }"
          :message="message"
        />

      </div>
    </div>

  </div>
</template>

<style scoped>

#chat_container {
  --n: 10;
  box-sizing: border-box;
  overflow: visible;
  display: flex;
  align-items: flex-end;
}

#chat {
  --back: var(--accent-light);
  box-sizing: border-box;
  width: 100%;
}

#chat:not(.expanded):hover .contents,
#chat:not(.expanded):focus-within .contents,
#chat:not(.expanded):focus .contents {
  max-height: 2rem;
  max-width: 100%;
  padding: 0;
}
#chat.expanded .contents {
  max-width: 100%;
  max-height: 90rem;
  padding: 0;
}

#chat .title {
}

#chat .contents {
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  align-items: flex-start;
  overflow: hidden;
}

#chat .contents #message_form {
  display: flex;
}
#chat .contents #message_form input[type="text"] {
  flex-grow: 1;
  min-width: 100%;
  height: 2rem;
}
#chat .contents #message_form input[type="submit"] {
  margin: 0 0.5rem;
  height: 100%;
}


.mobile #chat_container {
  padding: unset;
}


</style>
