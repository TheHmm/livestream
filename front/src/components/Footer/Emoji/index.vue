<script>
import { mapGetters } from 'vuex'
import Emo            from './Emo.vue'


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
      'get_event',
      'emoji_groups',
      'emoji_allowed'
    ]),
    ...mapGetters( 'viewers', [
      'uuid',
    ]),
    event() {
      return this.get_event( this.$route.params.slug )
    },
    can_send_emoji() {
      return (
        this.emoji_allowed &&
        !this.emoji_timeout &&
        !this.event.is_in_past
      )
    }
  },


  methods: {

    send( group, emoji ) {
      if ( !this.can_send_emoji ) {
        return
      }
      let timeout = 5000
      if ( emoji == 'hmmosphere' ) {
        timeout = 6 * timeout
      }
      this.emoji_timeout = setTimeout(() => {
        this.emoji_timeout = null
      }, timeout)
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
    role="menu"
    aria-label="Choose from several emoji to send"
  >
    <ul
      role="menu"
      class="group"
      v-for="group in emoji_groups"
      :aria-label="`Emoji group ${ group.name }`"
      :key="group.id"
    >
      <label> {{ group.name }}</label>
      <li
        v-for="emo in group.emoji"
        :aria-label="`Emoji ${ emo.name }`"
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
