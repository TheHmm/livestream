<script>
import { mapGetters } from 'vuex'
import Input from './Input.vue'
import Message from './Message.vue'

export default {

  name: 'Chat',
  
  components: {
    Message,
    Input
  },

  data() {
    return {
      expanded: false,
    }
  },

  computed: {
    ...mapGetters( 'messages', [ 
      'messages_array',
      'count'
    ]),

  },

  created() {
  },

  methods: {

    scrollToBottom(first) {
      setTimeout(() => {
        this.$refs.messages.scroll({
          top: this.$refs.messages.scrollHeight,
          behavior: 'smooth'
        })
      }, first ? 100 : 0)
    }

  },

  sockets: {
    message() {
      this.scrollToBottom()
    }
  },

  watch: {
    expanded() {
      if (this.expanded) {
        this.scrollToBottom( true )
      }
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
        <div 
          ref="messages"
          class="messages"
        >
          <Message
            v-for="( message, index ) in messages_array"
            :key="index"
            :style="{ '--n': count - index - 1 }"
            :message="message"
          />
        </div>
        <Input />
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
#chat .title {
  border-radius: unset;
  text-align: unset;
  justify-content: flex-start;
  align-items: center;
}
#chat .contents {
  width: 100%;
  overflow: hidden;
}
#chat.expanded .contents {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
#chat.expanded .contents {
  max-width: 100%;
  max-height: 100%;
  max-height: calc(100vh - 17rem);
  padding: 0;
  /* overflow: scroll; */
}
#chat .contents .messages {
  box-sizing: border-box;
  padding: 0.5rem 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: scroll;
}
#chat:not(.expanded):hover .contents,
#chat:not(.expanded):focus-within .contents,
#chat:not(.expanded):focus .contents {
  max-height: 2rem;
  max-width: 100%;
  padding: 0;
}




.mobile #chat_container {
  padding: unset;
}


</style>
