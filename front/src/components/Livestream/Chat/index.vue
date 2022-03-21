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


.mobile #chat_container {
  padding: unset;
}


</style>
