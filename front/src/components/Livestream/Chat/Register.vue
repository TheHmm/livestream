<script>
import { mapGetters } from 'vuex'
import Bot from '../../Utils/Bot.vue'

export default {
  
  name: 'Register',

  components: { Bot },
  
  data() {
    return {
      name: null,
      lifetime: null,
      agrees: false,
      sending: false,
      error: null,
      website: null
    }
  },

  computed: {
    ...mapGetters( 'viewers' , [ 'uuid' ] )
  },

  emits: [
    'close'
  ],


  methods: {

    async send( e ) {
      e.preventDefault()
      const { name, agrees, website, lifetime } = this
      if ( !name || !agrees || website ) { 
        return 
      }
      this.sending = true
      try {
        await this.$store.dispatch( 'viewers/create_viewer', { 
          name,
          lifetime
        })
        this.sending = false
        this.$emit('close')
      } catch ( error ) {
        this.error = error
      }
    },

  },

  mounted() {
    this.$el.showModal()
  },

  beforeUnmount() {
    this.$el.close()
  }
 
}
</script>

<template>
  <dialog
    :id="$id()"
  >
    <div v-if="error">
      <p> A server error seemed to have occurred. Please contact us.</p>
      <input 
        class="close"
        type="reset" 
        title="close."
        value="Close"
        @click="$emit('close')"
      />
    </div> 
    <div v-else-if="sending">
      <p> Creating viewer {{ name }}.</p>
    </div>
    <!-- <div v-else-if="uuid">
      <p> Success! Your uuid is <code>{{ uuid }}</code>.</p>
      <input 
        class="close"
        type="reset" 
        title="close."
        value="Close"
        @click="$emit('close')"
      />
    </div>  -->
    <form 
      v-else
      id="register_form"
      aria-label="Registration form"
      method="post"
      :onsubmit="send"
    >
      <label
        class="name"
        title="Display name"
      >
        <input 
          required
          type="text" 
          name="name" 
          id="name" 
          placeholder="name" 
          v-model.lazy.trim="name"
        />
        <span>pick a display name.</span>
      </label>
      <p>To better handle chat moderation and prevent abusive behaviour, we are introducing a cookie-like function to our livestream.</p>
      <p>When you submit your display name, a unique identifier <code>UID</code> will be created for you on our server and stored in your browser's <code>localStorage</code>.</p>
      <p>You can opt into automatic <em>scheduled anonymiztion</em>: specify a number of days after which your messages get anonymized. Keep this field empty to opt out of scheduled anonymization.</p>
      <label
        class="lifetime"
        title="User lifetime"
      >
        <input 
          type="number"
          min="1"
          max="365"
          v-model.lazy.trim="lifetime"
        />
        days.
      </label> 
      <p>If you need help with this or have any questions, please <a target="blank" href="https://thehmm.nl/contact/">contact us</a>.</p>
      <input 
        required
        type="checkbox"
        v-model="agrees"
        id="agrees"
      />
      <label
        title="Agree to these terms."
        class="agrees"
        for="agrees"
      >
      I agree to this condition.
      </label>
      <div class="row"> 
        <Bot v-model="website" />
        <input 
          class="close"
          type="reset" 
          title="close."
          value="Close"
          @click="$emit('close')"
          @key.esc.prevent="$emit('close')"
        />
        <input 
          class="submit"
          type="submit" 
          title="Register yourself."
          value="Submit"
        />
      </div>
    </form>


  </dialog>

</template>

<style scoped>

dialog {
  max-width: 25rem;
  box-shadow: var(--shadow);
  border: none;
}
dialog::backdrop {
  background-color: hsla(0, 0%, 0%, 0.3);
}
dialog code {
  font-size: 0.9rem;
}
dialog form label {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
dialog form label.name {
  flex-wrap: nowrap;
}
dialog form label.name input {
  margin-right: 0.5rem;
  width: 10rem;
}
dialog form label.agrees input {
  margin-right: 0.5rem;
}
dialog form label.lifetime input {
  width: 3rem;
  margin-right: 0.5rem;
}
dialog form label.agrees {
  margin-left: 0.5rem;
  margin-bottom: 1rem;
}
dialog form .row {
  display: flex;
}
dialog form input.submit {
  margin-left: auto;
}

</style>
