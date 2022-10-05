<script>
import { mapGetters } from 'vuex'
import Input          from './Input.vue'
import Message        from './Message.vue'


// Chat component. Handles all messaging UI functions, can
// be mounted as an independent view or sub-component.

export default {

  name: 'Chat',

  components: {
    Message,
    Input,
  },


  // This component inherits only the event fron it's parent
  // and handles the rest independently.

  props : {
    event: Object,
  },


  // UI options such as wether the chat is expanded or wether
  // to display only the links.

  data() {
    return {
      expanded   : this.$route.name == 'ChatPage',
      hide_input : this.$route.query.hide_input,
      links_only : false,
      loading    : null,
    }
  },


  // Messages array is gotten from the store and its length
  // is used to compute the background color of the messages

  computed: {
    ...mapGetters( 'messages', [
      'sorted_messages',
    ]),
    is_in_past() {
      return this.event?.is_in_past
    }
  },


  mounted() {
    if ( this.sorted_messages.length >= 20 ) {
      this.loading = 'load more messages'
    } else {
      this.loading = null
    }
    this.scroll_to_end( )
  },


  // Scroll to bottom of container when its height changes

  watch: {
    expanded() {
      if (this.expanded) {
        this.scroll_to_end( true )
      }
    },
    sorted_messages() {
      if ( this.sorted_messages.length >= 20 ) {
        this.loading = 'load more messages'
      } else {
        this.loading = null
      }
    }
  },


  // Scroll to bottom of container when getting a new message
  // or message update from strapi.

  sockets: {
    message() {
      this.scroll_to_end( )
    }
  },

  methods: {


    // Method to load more messages

    async load_more() {
      try {
        this.loading = 'loading...'
        const messages = await this.$store.dispatch(
          'messages/fetch_messages',
          this.event.id
        )
        if ( messages.length >= 20 ) {
          this.loading = 'load more messages'
        } else {
          this.loading = null
        }
      } catch (error ) {
        this.loading = 'error'
        console.error(error)
      }
    },



    // UI fuctions

    scroll_to_end( first ) {
      setTimeout(() => {
        this.$refs.messages.scroll({
          top: this.$refs.messages.scrollHeight,
          behavior: 'smooth'
        })
      }, first ? 100 : 50)
    },

    expand() {
      this.expanded = true
    },

    collapse() {
      this.expanded = false
    },


  },



}

</script>


<template>
  <div
    id="chat_container"
    aria-label="Chat"
  >

    <section
      :id="$id()"
      :class="[ 'tab', { expanded } ]"
      aria-label="View and send messages"
      tabindex="0"
      @click.stop="expand"
      @keyup.space="expand"
      @keyup.enter="expand"
    >

      <label
        class="title"
        :for="$id()"
      >
        <div
          v-if="expanded && !hide_input"
          class="options"
          aria-label="Chat options"
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
            value="save"
            aria-label="Save chat"
            class="close"
            name="save"
            type="button"
            @click.stop="$router.push({
              name: 'SavePage',
              params: $route.params
            })"
          />
          <input
            value="✕"
            aria-label="Close chat window"
            class="close circle"
            name="close"
            type="button"
            @click.stop="expanded = false"
          />
        </div>
        <span v-else>Chat</span>
      </label>

      <div class="contents">
        <Input
          v-if="!hide_input"
          :is_in_past="is_in_past"
        />
        <div
          ref="messages"
          class="messages"
          aria-label="Chat messages"
          tabindex="-1"
        >
          <div
            v-if="loading"
            id="load_more"
          >
            <a @click="load_more">
              {{ loading }}
            </a>
          </div>
          <Message
            v-for="( message, i ) in sorted_messages"
            :key="i"
            :style="{ '--n': sorted_messages.length - i - 1 }"
            :message="message"
            :links_only="links_only"
          />
        </div>
      </div>
    </section>

  </div>
</template>


<style scoped>

@import '@/assets/css/tabs.css';

#chat_container {
  /* height          : 100%; */
  --n             : 1;
  display         : flex;
  align-items     : flex-end;
}

#chat {
  --back          : var(--accent-light);
  width           : 100%;
}

#chat .title {
  align-items     : center;
  font-size       : var(--size-m);
}

#chat .title .options {
  font-family     : 'not-courier-sans', Arial, Helvetica, sans-serif;
  width           : 100%;
  display         : flex;
  font-size       : var(--size-s);
  gap             : 0.5rem;
}

#chat .title .options .links {
  display         : flex;
  align-items     : center;
  margin-right    : auto;
}

/* #chat .title .options .links label::before {
  margin-right    : unset;
  margin-left     : 0.5rem;
} */


#chat .contents {
  min-width       : 100%;
  width           : 100%;
  overflow        : hidden;
  display         : flex;
  flex-direction  : column-reverse;
  font-size       : var(--size-s);
}

#chat .contents >>> ul li {
  word-break      : break-all;
  padding         : 0;
}

#chat .contents .messages {
  --border        : 1px solid var(--accent);
  margin          : 0 0.5rem;
  padding         : 0.5rem 0rem;
  height          : 100%;
  display         : flex;
  flex-direction  : column;
  align-items     : flex-start;
  overflow        : scroll;
  border-top      : var(--border);
  border-bottom   : var(--border);
  /* causes this to stop scrolling  */
  /* justify-content: flex-end;  */
}

#chat .contents #load_more {
  width           : 100%;
  text-align      : center;
  font-size       : 0.66rem;
  opacity         : 0.6;
  margin-bottom   : var(--size-s);
}
#chat .contents #load_more a {
  cursor          : pointer;
}
#chat .contents #load_more:hover {
  opacity         : 1;
}

#chat.expanded .contents {
  min-height      : var(--height);
  max-height      : var(--height);
  max-width       : 100%;
}

.mobile #chat_container {
  padding         : unset;
}

.mobile #chat .title {
  font-size       : var(--size-s);
}


#chatpage #chat_container {
  --fore           : var(--black);
  width            : 100%;
  margin           : 0;
  height           : 100%;
}

#chatpage #chat_container #chat {
  --distance       : 100vh;
  height           : 100%;
}
#chatpage #chat_container #chat .contents:focus-within,
#chatpage #chat_container #chat.expanded .contents {
  --height        : calc( 100% - var(--base-height) );
}
#chatpage #chat_container #chat .options .close {
  display         : none;
}
#chatpage #chat_container #chat .contents {
  padding-bottom   : calc( var(--footer-height));
}
#chatpage.mobile #chat_container #chat .contents {
  padding-bottom   : calc( var(--footer-height) + 1rem );
}

#chatpage.hide_input #chat_container #chat .contents,
.mobile#chatpage.hide_input #chat_container #chat .contents {
  padding-bottom   : 0;
}




</style>
