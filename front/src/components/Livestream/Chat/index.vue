<script>
import { mapGetters } from 'vuex'
import Input from './Input.vue'
import Message from './Message.vue'

export default {

  name: 'Chat',
  
  components: {
    Message,
    Input,
  },

  data() {
    return {
      expanded: false,
      links_only: false,
    }
  },

  computed: {
    ...mapGetters( 'messages', [ 
      'messages_array',
      'count'
    ]),

  },

  watch: {

    messages_array:{
      handler() { this.scrollToBottom() },
      deep: true
    },

    expanded() {
      if (this.expanded) {
        this.scrollToBottom( true )
      }
    }
  },

  methods: {

    scrollToBottom(first) {
      setTimeout(() => {
        this.$refs.messages.scroll({
          top: this.$refs.messages.scrollHeight,
          behavior: 'smooth'
        })
      }, first ? 100 : 50)
    }

  },


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
      @keyup.space="expanded = true"
      @keyup.enter="expanded = true"
    >
      
      <label 
        class="title"
        :for="$id()"
      > 
        <div
          v-if="expanded"
          class="options"
        >
          <span class="links">
            <input 
              name="links"
              id="links"
              type="checkbox"
              v-model="links_only"
            />
            <label 
              title="Show only URLs"
              for="links"
            >
              Show only URLs
            </label>
          </span>
          <input 
            value="✕"
            class="close"
            name="close"
            type="button"
            @click.stop="expanded = false"
          />
        </div>
        <span v-else>Chat</span>
      </label>

      <div class="contents">
        <Input />
        <div 
          ref="messages"
          class="messages"
          tabindex="-1"
        >
          <Message
            v-for="( message, index ) in messages_array"
            :key="index"
            :style="{ '--n': count - index - 1 }"
            :message="message"
            :links_only="links_only"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

@import '@/assets/css/tabs.css';

#chat_container {
  --n: 10;
  overflow: visible;
  display: flex;
  align-items: flex-end;
}
#chat {
  --back: var(--accent-light);
  width: 100%;
}
#chat .title {
  border-radius: unset;
  text-align: unset;
  justify-content: flex-start;
  align-items: center;
  padding: 0 0.5rem;
  font-size: 1.33rem;
}
#chat .title .options {
  font-family: 'not-courier-sans', Arial, Helvetica, sans-serif;
  width: 100%;
  display: flex;
  align-items: center;
}
#chat .title .options .close,
#chat >>> #message_form input[type="submit"] {
  flex-shrink: 0;
  margin-left: 0.5rem;
  height: 1.33rem;
  width: 1.33rem;
  padding: 0rem 0.33rem;
  border-radius: 1rem;
}
#chat .title .options .links {
  margin-right: auto;
  display: flex;
  align-items: center;
  /* flex-direction: row-reverse; */
}
#chat .title .options .links label::before {
  /* margin-right: unset;
  margin-left: 0.5rem; */
}
#chat .contents {
  min-width: 100%;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  display: flex;
  flex-direction: column-reverse;
  padding: 0 !important;
}
#chat .contents >>> ul li {
  word-break  : break-all;
  padding: 0;
}
#chat.expanded .title {
  font-size: 1rem;
}
#chat .contents:focus-within,
#chat:hover .contents:focus-within,
#chat.expanded .contents {
  display: flex;
  flex-direction: column-reverse;
  pointer-events: all;
  max-width: 100%;
  min-height: calc(100vh - 17rem);
  max-height: calc(100vh - 17rem);
  padding: 0;
  /* overflow: scroll; */
}
#chat .contents .messages {
  --border: 1px solid var(--accent);
  margin: 0 0.5rem;
  padding: 0.5rem 0rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: scroll;
  border-top: var(--border);
  border-bottom: var(--border);
  /* causes this to stop scrolling  */
  /* justify-content: flex-end;  */
}

#chat:not(.expanded):focus .contents {
  padding: 0;
}


.mobile #chat_container {
  padding: unset;
}


</style>
