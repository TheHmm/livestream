<script>
import api from '@/api'
import Bot from '../../Utils/Bot.vue'


// Donation submenu. Makes a doation to The Hmm through mollie
// via our API as proxy with a POST request to /meta/donate
// containing the current event slug as a 'from' parameter
// in the post query so we are returned to the right place.

export default {

  name: 'Donate',

  components: {
    Bot
  },

  data() {
    return {
      donations: {
        '3.00': '🍺 => €3',
        '6.00': '🍻 => €6',
        '9.00': '🍸 => €9'
      },
      selected: null,
      website: null,
    }
  },

  methods: {


    // After receiving a payment object from Mollie through
    // our API, we redirect the user to the Mollie client
    // potal to conduct the payment with window.open(...)

    async donate( e ) { 
      e.preventDefault()
      console.log(this.website)
      if ( this.website !== null ) {
        return
      }
      try {
        const 
          payment = await api.meta.donate({
            amount      : this.selected,
            description : this.donations[this.selected],
            from        : this.$route.params.slug
          }),
          checkout = payment._links?.checkout?.href
        window.open( checkout, '_blank')
      } catch ( err ) {
        console.error(err)
      }
      this.selected = null
    },

    id( amount ) {
      return 'donate_' + amount.replace( '.00', '' )
    }

  }

}
</script>


<template>
  <form 
    :onsubmit="donate"
    @keyup.esc="selected = null"
  >

    <ul role="menu">
      <li 
        v-for="( label, amount ) in donations"
        :key="amount"
      >
        <input 
          type="radio"
          :name="label" 
          :value="amount"
          :id="id( amount )"
          v-model="selected"
        />
        <label 
          :title="label"
          :for="id( amount ) "
        >
          {{ label }}
        </label>
      </li>
    </ul>
    
    <Bot v-model="website" />

    <input 
      type="submit" 
      :disabled="!selected"
      :title="`Donate ${ selected } to The Hmm`"
      value="Send"
    />

  </form>
</template>


<style scoped>

input[type="submit"] {
  width         : calc(100%  - var(--size-s));
  margin        : 0.5rem;
  margin-bottom : 0rem;
}


</style>
