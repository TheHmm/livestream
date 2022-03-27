<script>
import api from '@/api'

export default {

  name: 'Donate',

  data() {
    return {
      donations: {
        '3.00': '🍺 => €3',
        '6.00': '🍻 => €6',
        '9.00': '🍸 => €9'
      },
      selected: null,
      website: '',
    }
  },

  methods: {

    async donate( e ) { 
      e.preventDefault()
      if (this.website !== '') {
        return
      }
      try {
        const 
          payment = await api.meta.donate({
            amount: this.selected,
            description: this.donations[this.selected],
            from: this.$route.params.slug
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
    
  <form :onsubmit="donate">

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

    <div class="bt">
      <label
        for="website"
        class="comment"
      >
        If you are not a bot, leave the below field empty.
      </label>
      <input 
        tabindex="-1"
        type="text" 
        name="website" 
        id="website" 
        placeholder ="http://example.com" 
        v-model="website"
      />
    </div>
    
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
  width: calc(100% - 1rem);
  margin: 0.5rem;
  margin-bottom: 0rem;
}
.bt {
  position: absolute;
  left: -90000px;
  top: -90000px;
}

</style>
