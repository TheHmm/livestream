<script>
import { mapActions, mapGetters } from 'vuex'
import Emo from './Emo.vue'

export default {

  name: 'Emoji',

  components : {
    Emo
  },

  computed: {
    ...mapGetters( 'events', [
      'emoji_groups'
    ]),
    ...mapGetters( 'viewers', [
      'uuid'
    ]),
  },

  methods: {


    send( group, emoji ) { 
      console.log( group, emoji)
      this.$socket.client.emit( 'emoji', {
        group,
        emoji,
        uuid : this.uuid 
      })
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
        @click="send( group.name, emo.name )"
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
