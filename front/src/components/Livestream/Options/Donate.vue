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
            from: this.$route.query.slug
          }),
          checkout = payment._links?.checkout?.href
        window.open( checkout, '_blank')
      } catch ( err ) {
        console.error(err)
      }
      this.selected = null
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
        role="menuitemradio"
      >
        <label 
          :title="label"
          tabindex="0"
        >
          <input 
            type="radio"
            :name="label" 
            :value="amount"
            v-model="selected"
          />
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
        type="text" 
        name="website" 
        id="website" 
        placeholder ="http://example.com" 
        v-model="website"
      />
    </div>
    
    <label>
      <input 
        type="submit" 
        :disabled="!selected"
        :title="`Donate ${ selected } to The Hmm`"
        value="Send"
      />
    </label>

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
  left: -99999999rem;
  top: -99999999rem;
}

</style>
