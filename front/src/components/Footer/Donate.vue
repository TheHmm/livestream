<script>
import api from '@/api'
import Bot from '../Utils/Bot.vue'


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
        '5.00': '🍺 => €5',
        '10.00': '🍻 => €10',
        '15.00': '🍸 => €15'
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
            from        : this.$route.params.slug || '/'
          }),
          checkout = payment._links?.checkout?.href
        window.location.href = checkout
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
    aria-label="Donation form"
  >

    <ul
      role="menu"
      aria-label="Choose an amount to donate"
    >
      <li
        v-for="( label, amount ) in donations"
        role="menuitem"
        :key="amount"
        :style="{ '--url': `url(@/assets/icons/donate-${id( amount )}.svg)` }"
      >
        <input
          type="radio"
          :name="label"
          :aria-label="amount + ' euros'"
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

input[type="radio"] + label::after  {
  /* background-image : var(--url); */
  /* background-image : url( '@/assets/icons/thumbs.svg' ); */
}


</style>
