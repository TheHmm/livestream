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
      expanded: false
    }
  },

  computed: {

    ...mapGetters( 'messages', [ 
      'messages_array',
    ]),

  },

}
</script>

<template>
  <div id="chat_container">
    <div
      :id="$id()"
      :class="[ 'tab', { expanded } ]"
      aria-label="chat"
      tabindex="0"
      @click="expanded = true"
    >
      <label 
        class="title"
        :for="$id()"
      > 
        <span>Chat</span>
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
      </label>
      <div class="contents">
        <Message
          v-for="message in messages_array"
          :key="message.time"
          :message="message"
        />
      </div>
    </div>
  </div>

</template>

<style scoped>

#chat_container {
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  overflow: visible;
  padding-right:1rem;  
  /* flex-basis: calc(var(--side-width)); */
  width: calc(var(--side-width));
  max-width: calc(var(--side-max-width));
}

#chat {
  box-sizing: border-box;
  width: 100%;
}

#chat:hover .contents,
#chat:focus-within .contents,
#chat:focus .contents {
  max-height: 1rem;
  max-width: 100%;
}
#chat.expanded .contents {
  max-width: 100%;
  max-height: 90rem;
}

#chat .title {
  justify-content: space-between;
}

#chat .contents {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  overflow: hidden;
}


.mobile #chat_container {
  padding: unset;
}


</style>
