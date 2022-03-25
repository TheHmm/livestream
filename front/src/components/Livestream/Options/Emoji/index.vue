<script>
import { mapGetters } from 'vuex'
import Emo from './Emo.vue'

export default {

  name: 'Emoji',

  components : {
    Emo
  },

  data() {
    return {
      selected: null,
      website: '',
    }
  },

  computed: {
    ...mapGetters( 'events', [
      'emoji_groups'
    ])
  },

  methods: {
    async send( e ) { 
      e.preventDefault()
      if (this.website !== '') {
        return
      }
      //  soccket send emote
      console.log(this.selected)
      this.selected = null
    }
  },

}
</script>

<template>
  <div :id="$id()">
    <ul 
      role="menu"
      class="group"
      v-for="group in emoji_groups"
      :key="group.id"
    >
      <label> {{ group.name }}</label>
      <Emo 
        v-for="emo in group.emoji"
        :key="emo.name"
        :emo="emo"
        @click="send( emo )"
      />      
    </ul>
  </div>
</template>

<style scoped>

#emoji {
  padding: 0 0.5rem;
}

#emoji .group {
  display: flex;
  flex-wrap: wrap;
}

#emoji .group label {
  font-size: 0.9rem;
  font-style: italic;
  --fore: var(--grey);
  width: 100%;
}

</style>
