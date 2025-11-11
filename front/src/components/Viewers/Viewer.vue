<script>
import Emo from '@/components/Footer/Emoji/Emo.vue'


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
      transitioning: false,
      position_throttle: 250,
      local_position: { x: 0, y: 0 },
    }
  },


  // Basic viewer properties

  computed: {
    uuid()    { return this.viewer.uuid },
    name()    { return this.viewer.name || 'unnamed viewer' },
    mobile()  { return this.$store.state.meta.mobile },
    is_me()   { return this.$store.getters['viewers/is_me']( this.viewer ) },
    nick()    { return this.is_me && this.name + ' (you)' || this.name },
    emoji()   { return this.viewer.emoji },
    n()       { return this.uuid[ this.uuid.length-1 ] },
    is_free() { return this.$store.getters[ 'events/release_dots' ] },
    pos() {
      let position = {
        x: this.local_position.x,
        y: this.local_position.y
      }
      if ( this.is_free && !this.is_me && this.viewer.position ) {
        position = {
          x: this.viewer.position.x,
          y: this.viewer.position.y
        } 
      }
      return position
    }
  },

  created() {
    this.set_position( this.get_random_position() )
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
      if ( this.is_me ) {
        return
      }
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
      this.transitioning = true
      setTimeout(() => this.transitioning = false, 500)
    },
    unfollow_cursor() {
      this.save_current_position()
      if ( this.mobile ) {
        this.$el.removeEventListener( "touchmove", this.touchmove)
        this.$el.removeEventListener( "touchmove", this.$throttle)
      } else {
        document.removeEventListener('mousemove', this.mousemove )
        document.removeEventListener('mousemove', this.$throttle )
      }
    },
    touchmove(e) {
      this.set_position( e.touches[0] )
    },
    mousemove(e) {
      this.set_position(e)
    },
    save_current_position() {
      const rect = this.$el.getBoundingClientRect()
      this.set_position({ 
        clientX: rect.left + 14, 
        clientY: rect.top + 14 
      })
    },  
    set_position(e) {
      this.local_position = { 
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      }
    },
    send_position() {
      this.$socket.client.emit( 'position', {
        uuid : this.uuid,
        position: this.pos
      })
    },
    get_random_position() {
      const header = document.querySelector('header')
      const max_x = header?.offsetWidth || Math.random() * 1000
      const min_x = header?.offsetLeft || Math.random() * 1000
      const max_y = header?.offsetHeight || Math.random() * 1000 
      const min_y = header ? header.offsetTop + 16 : Math.random() * 1000
      return { 
        clientX: Math.random() * (max_x - min_x) + min_x,
        clientY: Math.random() * (max_y - min_y) + min_y
      }
    }, 

  },

}

</script>

<template>
  <div
    :title="nick"
    :class="[ $id(), 'dot', { shaking, transitioning, emoji, is_free, is_me, mobile } ]"
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
  margin-left            : calc( var(--n) * var(--size-s));
  scale           : 1;
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
.viewer.emoji
.viewer.is_free {
  --shadow-size   : 0.5rem;
  opacity         : 1;
  z-index         : 1;
}

.viewer.is_free {
  position: fixed;
  margin-left: 0;
  top: calc( var(--y) * 100vh - 0.5 * var(--size));
  left: calc( var(--x) * 100vw - 0.5 * var(--size));
  outline: var(--focus);
}

.viewer.is_free.is_me:not(.transitioning) {
  transition: top 0s, left 0s;
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
