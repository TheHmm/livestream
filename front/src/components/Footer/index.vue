<script>

import Title  from './Title.vue'
import Access from './Access.vue'
import Modes  from './Modes.vue'
import Emoji  from './Emoji/index.vue'


// Our Footer component; contains all accessibility, viewing
// and donation options in the form of variable tabs. All tabs
// are defined here and selected in meta field of each route.

export default {

  name: 'Footer',

  components: {
    Title,
    Access,
    Modes,
    Emoji
  },

  data() {
    return {
      available_tabs: [
        {
          name       : 'access',
          label      : 'Accessibility',
          comp       : 'Access',
          aria_label : 'Accessibility options',
        },
        {
          name       : 'modes',
          label      : 'Stream modes',
          comp       : 'Modes',
          aria_label : 'Livestream player modes',
        },
        {
          name       : 'emoji',
          label      : 'Emotes',
          comp       : 'Emoji',
          aria_label : 'Emoji reactions',
        }
      ],
    }
  },

  computed: {

    emoji_groups() {
      return this.$store.getters[ 'events/get_event' ](
        this.$route.params.slug
      )?.emoji_groups
    },

    desired_tabs() {
      return this.$route.meta.desired_tabs
    },

    tabs() {
      if ( this.desired_tabs ) {
        return this.available_tabs.filter( t => {
          if ( this.desired_tabs.includes( t.name ) ) {
            if ( t.name == 'emoji' ) {
              return this.emoji_groups && this.emoji_groups.length 
            }
            return true
          }
        })
      } else {
        return []
      }
    },


    // We used the longest label to generate properly
    // sized curved texts in the Title component

    longest() {
      return Math.max.apply( null, this.tabs.map( t => t.label.length ) )
    },

  },

  mounted() {
    document.addEventListener('click', this.clear)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clear)
  },

  methods: {
    show(e) {
      e.currentTarget.classList.add('visible')
    },
    hide(e) {
      e.currentTarget.classList.remove('visible')
    },
    toggle(e) {
      if ( e.currentTarget.classList.contains('visible') ) {
        this.hide(e)
      } else {
        this.show(e)
      }
    },
    clear() {
      document.querySelectorAll( '.tab.visible' ).forEach(e => {
        e.classList.remove('visible')
      })
    }
  }

}
</script>


<template>
  <footer
    aria-label="Accessibility, viewing and donation options."
    v-if="tabs.length"
  >
    <transition-group
      name="tab_enter"
      appear
    >

      <section
        v-for="( tab, index ) in tabs"
        :key="tab.name"
        :id="tab.name"
        :ref="tab.name"
        :aria-label="tab.aria_label"
        class="tab"
        :style="{
          '--n': index ,
          '--i': tabs.length - index
        }"
        @click.stop="toggle"
      >

        <Title
          :tab="tab"
          :longest="longest"
        />

        <div class="contents">
          <Component :is="tab.comp" />
        </div>

      </section>

    </transition-group>
  </footer>
</template>


<style scoped>

@import '@/assets/css/tabs.css';

footer {
  max-height       : var(--footer-height);
  position         : fixed;
  bottom           : 1rem;
  right: 0;
  width            : 100%;
  max-width        : calc( var(--main-width) - 1rem );
  padding          : 0 var(--size-s);
  display          : flex;
  flex-direction: row-reverse;
  align-items      : flex-end;
  gap: 1rem;
  z-index          : 2;
  overflow         : visible;
}




footer .tab {
  --distance     : 5rem;
  background-color : var(--back);
  transform: translateY(0);
}
.tab_enter-enter-active {
  animation        : tab_enter var(--enter) ease calc( 0.4s + var(--n) *  0.1s) both;
}
.tab_enter-leave-active {
  animation        : tab_enter var(--enter) ease calc( var(--i) *  0.1s ) reverse both;
}
@keyframes tab_enter {
  from { transform : translateY( var(--distance) ) }
  to   { transform : translateY(0) }
}

/* footer .tab:focus .contents,
footer .tab:focus-within .contents,
footer .tab:hover .contents  */
footer .tab.visible .contents 
{
  padding-bottom : 0.5rem;
}

footer .tab .contents :deep(ul) {
  margin         : auto;
}

footer .tab .contents :deep(ul li) {
  display        : flex;
  align-items    : center;
}
footer .tab .contents :deep(ul li::before ){
  content        : unset;
}

footer .tab:has(.disabled) {
  /* display: none; */
  transform : translateY( 10rem )
}

.mobile footer {
  padding          : 0;
  flex-direction   : row-reverse;
  flex-wrap        : wrap;
  max-width        : unset;
  flex-direction   : column-reverse;
  align-items: flex-start;
  z-index        : 3;
  max-height     : var(--base-height);
  bottom: 0.5rem;
}

.mobile footer .tab {
  position       : absolute;
  /* left           : 15%; */
  left           : 1rem;
  margin-left    : calc( 4 * var(--n) * var(--size-s));
}
.mobile footer .tab:first-of-type {
  margin-left    : 0;
}
/* .mobile footer .tab:focus ,
.mobile footer .tab:focus-within ,
.mobile footer .tab:hover  */
.mobile footer .tab.visible
{
 margin-left    : calc( -2.5 * var(--n) * var(--size-s));
 margin-left    : calc( 2.5 * var(--n) * var(--size-s));
}

/* .mobile footer .tab:focus .contents,
.mobile footer .tab:focus-within .contents,
.mobile footer .tab:hover .contents  */
.mobile footer .tab.visible .contents
{
  padding-bottom : var(--base-height);
  --width        : 12rem;
  min-width: var(--width);
  max-width: var(--width);
}
.chatpage footer #modes {
  display: none;
}

.mobile.chatpage footer .tab {
  margin-left    : calc( -1 * var(--size-s));
}
.mobile.chatpage footer .tab:first-of-type {
  margin-left    : 0;
}

/* .mobile.chatpage footer .tab:focus ,
.mobile.chatpage footer .tab:focus-within ,
.mobile.chatpage footer .tab:hover  */
.mobile.chatpage footer .tab.visible
{
 margin-left    : calc( -1.5 * var(--n) * var(--size-s));
}
</style>
