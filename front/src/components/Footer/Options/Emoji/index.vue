<script>
import { mapGetters } from 'vuex'
import Emo from './Emo.vue'


// Custom emoji 

export default {

  name: 'Emoji',

  components : {
    Emo
  },

  data() {
    return {
      emoji_timeout: null,
    }
  },
  
  computed: {
    ...mapGetters( 'events', [
      'emoji_groups',
      'emoji_allowed',
    ]),
    ...mapGetters( 'viewers', [
      'uuid',
    ]),
    can_send_emoji() {
      return this.emoji_allowed && !this.emoji_timeout
    }
  },


  methods: {

    send( group, emoji ) { 
      if ( !this.can_send_emoji ) {
        return
      }
      this.emoji_timeout = setTimeout(() => {
        this.emoji_timeout = null
      }, 5000) 
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
  <div 
    :id="$id()"
    :class="{ disabled: !can_send_emoji }"
  >
    <ul 
      role="menu"
      class="group"
      v-for="group in emoji_groups"
      :key="group.id"
    >
      <label> {{ group.name }}</label>
      <li
        v-for="emo in group.emoji"
        :key="emo.name"
      >
        <Emo 
          :emo="emo"
          @click="send( group.slug, emo.name )"
          @keyup.space="send( group.slug, emo.name )"
          @keyup.enter="send( group.slug, emo.name )"
        />  
      </li>    
    </ul>
  </div>
</template>


<style scoped>

#emoji {
  padding    : 0 0.5rem;
}

#emoji .group {
  display    : flex;
  flex-wrap  : wrap;
}

#emoji .group label {
  font-size  : 0.9rem;
  font-style : italic;
  --fore     : var(--grey);
  width      : 100%;
}

#emoji .group li {
  padding    : 0rem !important;
  margin     : 0.2rem;
}

#emoji >>> .emo {
  cursor     : pointer;
}

#emoji.disabled >>> .emo {
  cursor     : not-allowed;
  opacity    : 0.4;
  filter     : grayscale(1);
}

</style>
