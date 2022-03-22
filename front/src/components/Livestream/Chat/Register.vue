<script>
import { mapGetters } from 'vuex'

export default {

  name: 'Register',
  
  components: {
  },

  props: {
    uuid: {
      type: String
    }
  },

  data() {
    return {
      name: null,
      lifetime: null,
      agrees: false,
      sending: false,
    }
  },

  computed: {

    ...mapGetters( 'events', [ 'current_event' ] ),
    event_id( ) { return this.current_event.id }

  },

  methods: {

    async send( e ) {
      e.preventDefault()
      const { name, event_id, agrees } = this
      console.log(name, event_id, agrees)
      if ( !name || !event_id || !agrees ) { 
        return 
      }
      this.sending = true
      try {
        const viewer = await this.$store.dispatch( 'viewers/create_viewer', {
          name,
          event_id
        })
        this.sending = false
      } catch ( error ) {
        console.error( error )
      }
    }
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
    <div v-if="uuid">
      <p> Success! Your uuid is {{ uuid }}.</p>
      <input 
        class="close"
        type="reset" 
        title="close."
        value="Close"
        @click="$el.close()"
      />
    </div> 
    <div v-else-if="sending">
      <p> Creating viewer {{ name }}.</p>
    </div>
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
        Pick a display name:
        <input 
          required
          type="text" 
          name="name" 
          id="name" 
          placeholder="name" 
          v-model.lazy.trim="name"
        />
      </label>
      <p>To better handle chat moderation and prevent abusive behaviour, we are introducing a cookie-like function to our livestream.</p>
      <p>When you submit your display name, a unique identifier <code>UID</code> will be created for you on our server and stored in your browser's <code>localStorage</code>.</p>
      <p>You can opt into automatically deleting your <code>UID</code> from our server after some time has passed. Your messages will remain on our server, but be anonymised. Keep this field empty to opt out of auto-deletion.</p>
      <label
        class="lifetime"
        title="User lifetime"
      >
        <input 
          type="number"
          min="1"
          max="365"
          v-bind="lifetime"
        />
        days.
      </label> 
      <p>If you need help with this or have any questions, please <a target="blank" href="https://thehmm.nl/contact/">contact us</a>.</p>
      <label
        title="Agree to these terms."
        class="agrees"
      >
        <input 
          required
          type="checkbox"
          v-model="agrees"
        />
        I agree to this condition.
      </label>
      <div class="row"> 
        <input 
          class="close"
          type="reset" 
          title="close."
          value="Close"
          @click="$el.close()"
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
dialog form label.name input {
  margin-left: 0.5rem;
}
dialog form label.agrees input {
  margin-right: 0.5rem;
}
dialog form label.lifetime input {
  width: 3rem;
  margin-right: 0.5rem;
}
dialog form label.agrees {
  margin: 1rem 0;
}
dialog form .row {
  display: flex;
}
dialog form input.submit {
  margin-left: auto;
}

</style>
