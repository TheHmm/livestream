<script>
import _throw       from '@/utils/throw'
import SaveMessage  from './SaveMessage.vue'

// Save component. Saves chat URLs as HTML.

export default {

  name: 'Save',

  components: {
    SaveMessage
  },

  // This component inherits only the event fron it's parent
  // and handles the rest independently.

  props : {
    event: Object,
  },


  data() {
    return {
      messages_array : null,
      links_only     : false,
    }
  },

  // Messages array is gotten from the api and its length
  // is used to compute the background color of the messages

  async created() {
    try {
      this.messages_array = await this.$store.dispatch(
        'messages/fetch_all_event_messages',
        this.event.id
      )
    } catch ( error ) {
      _throw( error )
      throw error
    }
  },

  methods: {
    print() {
      window.print()
    }
  }


}

</script>


<template>
  <section
    id="chat"
    aria-label="View and print messages"
    tabindex="0"
  >

    <div
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
        value="print"
        aria-label="Print chat"
        class="close"
        name="close"
        type="button"
        @click.stop="print"
      />
    </div>

    <header>
      <label for="chat">
        <h1>Chat</h1>
      </label>
      <p> Chat messages {{ links_only && 'with links' || '' }} from The Hmm Livestream event
        <b>{{ event.title }}</b>. Generated on <i><time :datetime="$time.now()"> {{ $time.long_date_format($time.now()) }}</time></i>.</p>
    </header>

    <div
      ref="messages"
      class="messages"
      aria-label="Chat messages"
      tabindex="-1"
    >
      <SaveMessage
        v-for="( message, i ) in messages_array"
        :key="i"
        :style="{ '--n': messages_array.length - i - 1 }"
        :message="message"
        :links_only="links_only"
      />
    </div>

  </section>
</template>


<style scoped>

@import '@/assets/css/tabs.css';


#chat {
  --back          : var(--accent-light);
  --fore          : var(--black);
  background      : var(--back);
  width           : 100%;
}


#chat .options {
  --back          : var(--accent-light);
  font-family     : 'not-courier-sans', Arial, Helvetica, sans-serif;
  font-size       : var(--size-m);
  width           : 100%;
  display         : flex;
  align-items     : center;
  gap             : 0.5rem;
  font-size       : var(--size-s);
  background      : var(--accent-lighter);
  padding         : 0.5rem;
  position        : sticky;
  top             : 0;
  z-index         : 2;
  /* display: none; */
}

#chat .options .links {
  display         : flex;
  align-items     : center;
}


#chat header {
  padding         : 0.5rem;
}


#chat >>> ul li {
  word-break      : break-all;
  padding         : 0;
  list-style      : none;
}

#chat .messages {
  min-width       : 100%;
  width           : 100%;
  font-size       : var(--size-s);
  padding         : 0.5rem;
}

@media print {
  #chat .options {
    display: none
  }
}

.mobile #chat .messages {
}

</style>
