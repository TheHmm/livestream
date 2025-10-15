<script>
import Emo from '../../Footer/Emoji/Emo.vue'


// Viewer dot, will mount an emoji if a user has made that
// reaction.

export default {

  name: 'Viewer',
  components: { Emo },
  props: { viewer: Object },


  // Clicking on a dot will make it shake

  data() {
    return {
      shaking: false,
      position_throttle: 500,
      own_position: { x: 10, y: 250 },
    }
  },


  // Basic viewer properties

  computed: {
    uuid()    { return this.viewer.uuid },
    name()    { return this.viewer.name || 'unnamed viewer' },
    mobile()  {  return this.$store.state.meta.mobile },
    is_me()   { return this.$store.getters['viewers/is_me']( this.viewer ) },
    nick()    { return this.is_me && this.name + ' (you)' || this.name },
    emoji()   { return this.viewer.emoji },
    n()       { return this.uuid[ this.uuid.length-1 ] },
    is_free() { return this.$store.getters[ 'events/release_dots' ] },
    pos() {
      if ( this.is_free ) {
        if ( this.is_me ) {
          return this.own_position
        } else {
          return {
            x: this.viewer.position?.x || 0,
            y: this.viewer.position?.y || 0
          } 
        }
      } else {
        return { x: 0, y:0 }
      }
    }
  },

  mounted() {
    if ( this.is_free && this.is_me ) {
      this.follow_cursor()
    }
  },

  beforeUnmount() {
    if ( this.is_free && this.is_me ) {  
      this.unfollow_cursor()
    }  
  },

  watch: {
    is_free() {
      if ( this.is_free && this.is_me ) {
        this.follow_cursor()
      } else {
        this.unfollow_cursor()
      }
    }
  },

  methods: {
    shake() {
      this.shaking = true
      setTimeout(() => {
        this.shaking = false
      }, 1500)
    },
    follow_cursor() {
      if ( this.mobile ) {
        this.$el.addEventListener( "touchmove", this.touchmove)
        this.$el.addEventListener( "touchmove", this.$throttle( this.send_position, this.position_throttle ))
      } else {
        document.addEventListener( "mousemove", this.mousemove)
        document.addEventListener( "mousemove", this.$throttle( this.send_position, this.position_throttle ))
      }
    },
    touchmove(e) {
      this.set_position( e.touches[0] )
    },
    mousemove(e) {
      this.set_position(e)
    },
    set_position(e) {
      this.own_position = { 
        x: e.clientX,
        y: e.clientY
      }
    },
    send_position() {
      this.$socket.client.emit( 'position', {
        uuid : this.uuid,
        position: this.pos
      })
    },
    unfollow_cursor() {
      if ( this.mobile ) {
        this.$el.removeEventListener( "touchmove", this.touchmove)
        this.$el.removeEventListener( "touchmove", this.$throttle)
      } else {
        document.removeEventListener('mousemove', this.mousemove )
        document.removeEventListener('mousemove', this.$throttle )
      }
    }

  },

}

</script>

<template>
  <div
    :title="nick"
    :class="[ $id(), 'dot', { shaking, emoji, is_free, is_me, mobile } ]"
    :style="{ '--n': n, '--x': pos.x, '--y': pos.y }"
    :aria-label="`Dot for viewer ${ name }`"
    tabindex="-1"
    @click="shake"
  >
    <transition name="dot" mode="in-out">
      <Emo
        v-if="emoji"
        :emo="emoji"
        :aria-label="`Emoji from viewer ${ name }`"
      />
    </transition>
  </div>
</template>

<style scoped>

@import '@/assets/css/dot.css';

.viewer {
  --fore          : var(--accent-lighter);
  --back          : var(--accent-light);
  position        : relative;
  opacity         : 0.8;
  display         : flex;
  justify-content : center;
  align-items     : center;
  margin-left     : calc( var(--n) * var(--size-s));
  /* transform       : scale(1); */
  scale: 1;
  transition      : all var(--slow) ease;
}


.viewer.dot-enter-active,
.viewer.dot-leave-active,
.viewer.dot-move {
  transition      : all var(--slow) ease;
}
.dot-enter-to,
.dot-leave-from {

}
.dot-enter-from,
.dot-leave-to {
  /* transform       : scale(0); */
  scale: 0;
  /* transition      : all var(--slow) ease; */
}
.viewer.dot-leave-active {
  position        : absolute;
}

.viewer:hover,
.viewer:focus,
.viewer.emoji {
  --shadow-size   : 0.5rem;
  opacity         : 1;
  z-index         : 1;
}

.viewer.is_free {
  margin-left: 0;
  position: fixed;
  top: calc( var(--y) * 1px - 0.5 * var(--size));
  left: calc( var(--x) * 1px - 0.5 * var(--size));
}

.viewer.is_free.is_me {
  transition: top 0s ease, left 0s ease;
  pointer-events: none;
}
.viewer.is_free.is_me.mobile {
  pointer-events: all;
  --size           : 1.5rem;
}

.viewer >>> .emo {
  --fore          : var(--black);
  border-radius   : inherit;
  transform       : scale(1);
  transition      : transform var(--slow) ease;
}

.viewer >>> .emo img {
  border-radius   : inherit;
}
.viewer >>> .dot-enter-from,
.viewer >>> .dot-leave-to {
  /* transform       : scale(0); */
}

.viewer.emoji {
  transform       : scale(2);
  max-width       : 10rem;
  max-height      : 10rem;
}



</style>
