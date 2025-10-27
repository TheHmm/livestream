<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Emoji          from './Emoji.vue'

// Emoji reactions

// on click outside
// mobile

export default {

  name: 'Reactions',

  components : {
    Emoji
  },

  props: {
    received_reactions: { type: Array, default: [] },
    message: Object
  },

  data() {
    return {
      show_available: false,
    }
  },

  computed: {
    ...mapGetters( 'events', [
      'get_event',
      'emoji_groups',
      'emoji_allowed'
    ]),
    ...mapGetters( 'viewers', [
      'my_id',
      'me'
    ]),
    event() {
      return this.get_event( this.$route.params.slug )
    },
    can_send_emoji() {
      return (
        this.event &&
        this.emoji_allowed &&
        !this.event.is_in_past
      )
    },
    ordered_received_reactions() {
      const ordered_received_reactions = {}
      this.received_reactions.map( reaction => {
        const emoji = reaction.Emoji
        if ( !ordered_received_reactions[emoji.name] ) {
          const senders = this.received_reactions
            .filter( r => r.Emoji.name == reaction.Emoji.name )
            .map( r => r.sender )
          ordered_received_reactions[emoji.name] = {
            emoji,
            senders
          }
        }
      })
      return ordered_received_reactions
    }
  },


  methods: {

    ...mapMutations( 'viewers', [
      'set_request_registration'
    ]),
    ...mapActions( 'viewers', [
      'authenticate'
    ]),
    ...mapActions( 'messages', [
      'update_message',
    ]),

    handle_available_reaction_click( emoji ) {
      const reaction = {
        Emoji: emoji,
        sender: this.me
      }
      this.send_reaction( reaction )
    },

    handle_received_reaction_click( emoji ) {
      const found_reaction = this.received_reactions.find( r => {
        return r.sender.documentId == this.me.documentId && r.Emoji.name == emoji.name 
      })
      if ( found_reaction ) {
        this.unsend_reaction( found_reaction ) 
      } else {
        const reaction = {
          Emoji: emoji,
          sender: this.me
        }
        this.send_reaction( reaction )
      }
    },

    async unsend_reaction( reaction ) {
      const reactions = this.received_reactions.filter( r => r.id !== reaction.id )
      this.post_reactions( reactions )
    },

    async send_reaction( reaction ) {
      if ( !this.can_send_emoji ) {
        return
      }
      let reactions
      if (this.received_reactions) {
        reactions = [ ...this.received_reactions, ...[ reaction ] ]
      } else {
        reactions = [ reaction ]
      }
      this.post_reactions( reactions )
    },

    async post_reactions( reactions ) { 
      let reactions_to_send = []
      reactions.map( r => {
        const reaction = {
          Emoji: {
            name: r.Emoji.name,
            image: r.Emoji.image?.id || null,
          }, 
          sender: r.sender.documentId,
        }
        if ( r.id ) {
          reaction.id = r.id
        }
        reactions_to_send.push( reaction )
        return r
      })
      try {
        if ( await this.authenticate() ) {
          await this.update_message({ 
            documentId: this.message.documentId, 
            data: { Reactions: reactions_to_send } 
          })
        } else {
          this.set_request_registration( true )
        }
       } catch ( error ) {
        console.error( error )
        this.set_request_registration( true )
      }
      this.show_available = false
    }

  },

}
</script>


<template>
  <div 
    role="menu"
    :class="[ 'reactions', { disabled: !can_send_emoji, show_available }]"
    aria-label="Choose from several emoji to send"
  >
    <div class="received_reactions">
      <!-- <ul aria-label="Emoji reactions"> -->
        <TransitionGroup name="emoji" tag="ul">
          <li
            v-for="({ emoji, senders }, name) of ordered_received_reactions"
            :aria-label="`Emoji ${ name }`"
            :key="name"
            @click="handle_received_reaction_click(emoji)"
            @keyup.space="handle_received_reaction_click(emoji)"
            @keyup.enter="handle_received_reaction_click(emoji)"
          >
            <Emoji :emoji="emoji" />
            <span class="senders">
              <span 
                v-if="senders.length > 1"  
                class="count"
              >{{ senders.length }}</span>
            </span>  
          </li>
        <li
          v-if="!show_available"
          class="add_reaction"
          @click="show_available = true"
        >
          <div>+</div>
        </li>
        <li
          v-else
          class="add_reaction"
          @click="show_available = false"
        >
          <div>-</div>
        </li>
        </TransitionGroup>
      <!-- </ul> -->
    </div>

    <!-- only show this element when we want to react -->
    <div 
      class="available_reactions"
        v-if="show_available"
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
          v-for="emoji in group.emoji"
          :aria-label="`Emoji ${ emoji.name }`"
          :key="emoji.name"
        >
          <Emoji
            :emoji="emoji"
            @click="handle_available_reaction_click( emoji )"
            @keyup.space="handle_available_reaction_click( emoji )"
            @keyup.enter="handle_available_reaction_click( emoji )"
          />
        </li>
      </ul>
    </div>
  </div>
</template>


<style scoped>

.reactions {
  position: absolute;
  bottom: -1.25rem;
  right: -1rem;
  max-width: fit-content;
  max-height: calc(1rem + 2px);
  overflow: hidden;
  transition: 
    max-height var(--fast) ease, 
    max-width var(--fast) ease,
    border var(--fast) ease,
    background-color var(--fast) ease,
    box-shadow var(--fast) ease
  ;
  z-index: 1;
  border: 1px solid transparent;
  box-shadow: 0 0 0 var(--shadow-color);
  display: flex;
  flex-direction: column;
}

.mine .reactions {
  right: 0;
  left: -1rem;
}

/* .reactions:hover, */
.reactions:focus-within,
.reactions.show_available {
  max-width: calc(0.9 * var(--side-width));
  max-height: 10rem;
  overflow: visible;
}
.reactions .received_reactions {
  z-index: 1;
}
.reactions .received_reactions ul {
  display: flex;
  overflow: visible;
}
.reactions .received_reactions li {
  max-height: 1rem;
  display: flex;
  align-items: stretch;
  background-color: var(--accent-lighter);
  border: 1px solid var(--accent-dark);
  border-radius: 0.4rem;
  box-shadow: 0 0 0px var(--shadow-color);
  transition: 
    max-height var(--fast) ease, 
    box-shadow var(--fast) ease
  ;
}
.reactions .received_reactions li .senders {
  font-size: 0.8rem;
}
.reactions .received_reactions li .senders .count {
  padding-inline: 0.15rem;
}

.reactions .received_reactions li .emoji {
  max-height: inherit;
  transition: 
    max-height var(--fast) ease, 
  ;
}

.reactions:focus-within .received_reactions li,
.reactions.show_available .received_reactions li {
  box-shadow: var(--shadow);
  max-height: 2rem;
}

.reactions:focus-within .received_reactions li .emoji,
.reactions.show_available .received_reactions li .emoji {
  max-height: 2rem;
}

.reactions .received_reactions li.add_reaction {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--accent-dark);
  border-radius: 100%;
  height: 1rem;
  width: 1rem;
  background-color: var(--accent-lighter);
  opacity: 0;
  cursor: pointer;
}

.message:hover .reactions .received_reactions li.add_reaction {
  opacity: 1;
}



.reactions .available_reactions {
  margin-top: 0.3rem;
  max-height: 100%;
  padding    : 0.5rem;
  background-color: var(--accent-lighter);
  border: 1px solid var(--accent-dark);
  overflow: scroll;
  box-shadow: var(--shadow);
  border-radius: 0.4rem;
}

.reactions .available_reactions .group {
  display    : flex;
  flex-wrap  : wrap;
}

.reactions .available_reactions .group label {
  font-size  : 0.9rem;
  font-style : italic;
  --fore     : var(--grey);
  width      : 100%;
}

.reactions .available_reactions .group li {
  padding    : 0rem !important;
  margin     : 0.2rem;
}

.reactions li::before {
  content: '';
}

.reactions >>> .emo {
  cursor     : pointer;
}

.reactions.disabled >>> .emo {
  cursor     : not-allowed;
  opacity    : 0.4;
  filter     : grayscale(1);
}

.emoji-enter-active,
.emoji-leave-active,
.emoji-move {
  transition      : all var(--slow) ease;
}
.emoji-enter-to,
.emoji-leave-from {

}
.emoji-enter-from,
.emoji-leave-to {
  /* transform       : scale(0); */
  scale: 0;
   transform: translateX(30px);
  /* transition      : all var(--slow) ease; */
}
.emoji-leave-active {
  position        : absolute;
}

</style>
