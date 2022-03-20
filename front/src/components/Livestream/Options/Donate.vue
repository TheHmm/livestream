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
        await api.meta.donate({
          amount: this.selected,
          description: this.donations[this.selected]
        })
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

    <ul>
      <li 
        v-for="( label, amount ) in donations"
        :key="amount"
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

    <div 
      v-if="selected"
      class="ready"
    >
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
          :title="`Donate ${ selected } to The Hmm`"
          value="Send"
        />
      </label>
    </div>

  </form>
</template>

<style scoped>

.ready {
  max-width: 10rem;
  padding: 0 0.5rem;
}
.ready input {
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 0.5rem;
}
.ready input[type="text"] {
  margin-top: 0.5rem;
}
.ready input[type="submit"] {
}

</style>
