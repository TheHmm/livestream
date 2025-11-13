<script>

import Title  from './Title.vue'
import About  from './About.vue'
import Access from './Access.vue'
import Year   from './Year.vue'
import Modes  from './Modes.vue'
import Emoji  from './Emoji/index.vue'


// Our Footer component; contains all accessibility, viewing
// and donation options in the form of variable tabs. All tabs
// are defined here and selected in meta field of each route.

export default {

  name: 'Footer',

  components: {
    Title,
    About,
    Access,
    Year,
    Modes,
    Emoji
  },

  data() {
    return {
      available_tabs: [
        {
          name       : 'about',
          label      : 'About',
          comp       : 'About',
          aria_label : 'About this website',
        },
        {
          name       : 'access',
          label      : 'Accessibility',
          comp       : 'Access',
          aria_label : 'Accessibility options',
        },
        {
          name       : 'year',
          label      : 'Choose a year',
          comp       : 'Year',
          aria_label : 'Choose a year'
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
      expanded: false,
    }
  },

  computed: {

    desired_tabs() {
      return this.$route.meta.desired_tabs
    },

    tabs() {
      if ( this.desired_tabs ) {
        return this.available_tabs.filter( t => {
          return this.desired_tabs.includes( t.name )
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


  methods: {
    expand( name ) {
      if ( name == 'about' ) {
        this.expanded = true
      }
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
        :class="[
          'tab',
          { expanded }
        ]"
        :style="{
          '--n': index ,
          '--i': tabs.length - index
        }"
        @click.stop="expand( tab.name ) "
      >

        <Title
          :tab="tab"
          :longest="longest"
        />

        <div class="contents">
          <header
            v-if="tab.name == 'about'"
            aria-label="About section toggle"
          >
            <input
              :value=" expanded ? '✕' : 'click to enlarge' "
              :class="[ 'close', { circle: expanded } ]"
              name="close"
              type="button"
              @click.stop="expanded = !expanded"
            />
          </header>
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
  bottom           : 0;
  width            : 100%;
  max-width        : calc( var(--main-width) - 1rem );
  padding          : 0 var(--size-s);
  display          : flex;
  align-items      : flex-end;
  z-index          : 2;
  overflow         : visible;
}

.mobile footer {
  padding          : 0;
  flex-direction   : row-reverse;
  flex-wrap        : wrap;
  max-width        : unset;
}

.mobile footer {
  flex-direction   : column-reverse;
}


footer .tab {
  --distance     : 5rem;
  --radius       : calc( 2rem + var(--base-height) ) 100%;
  border-top-left-radius  : var(--radius);
  border-top-right-radius : var(--radius);
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

footer .tab:not(:first-of-type) {
  margin-left    : calc( -1 * var(--size-s));
}

footer .tab:focus .contents,
footer .tab:focus-within .contents,
footer .tab:hover .contents {
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

footer .tab#about {
  --back: var(--black);
  --fore: var(--white);
  max-width : var(--tab-width);
}

footer .tab#about header {
  position: sticky;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  z-index: 1;
}
footer .tab#about.expanded header {
  justify-content: flex-end;
}

footer .tab#about.expanded {
  --full-height: calc( 100vh - 8rem );
}

footer .tab#about.expanded .contents,
footer .tab#about.expanded:hover .contents,
footer .tab#about.expanded:focus .contents,
footer .tab#about.expanded:focus-within .contents {
  min-height: var(--full-height);
  min-width: calc( 100vw - 2rem );
  max-width: calc( 100vw - 2rem );
}

.mobile footer {
  margin         : unset;
  z-index        : 3;
  max-height     : var(--base-height);
  /* --radius       : calc( 5rem + var(--base-height) ) 100%; */
  --radius       : calc( 5rem ) 100%;

  /* padding-left: ; */
  /* flex-wrap: wrap; */
  /* overflow-x     : scroll; */
}

.mobile footer .tab {
  /* margin-left    : calc( -3 * var(--size-s)); */
  position       : absolute;
  /* left           : 15%; */
  left           : 0;
  margin-left    : calc( 3.5 * var(--n) * var(--size-s));
}
.mobile footer .tab:first-of-type {
  margin-left    : 0;
}
.mobile footer .tab:focus ,
.mobile footer .tab:focus-within ,
.mobile footer .tab:hover {
 margin-left    : calc( -2.5 * var(--n) * var(--size-s));
 margin-left    : calc( 2.5 * var(--n) * var(--size-s));
}

.mobile footer .tab:focus .contents,
.mobile footer .tab:focus-within .contents,
.mobile footer .tab:hover .contents {
  padding-bottom : var(--base-height);
  --width        : 12rem;
  min-width: var(--width);
  max-width: var(--width);
}
.chatpage footer #modes {
  display: none;
}


.mobile footer .tab#about header {
  justify-content: left;
}
.mobile footer .tab#about.expanded header {
  justify-content: flex-end;
}

.mobile.chatpage footer .tab {
  margin-left    : calc( -1 * var(--size-s));
}
.mobile.chatpage footer .tab:first-of-type {
  margin-left    : 0;
}

.mobile.chatpage footer .tab:focus ,
.mobile.chatpage footer .tab:focus-within ,
.mobile.chatpage footer .tab:hover {
 margin-left    : calc( -1.5 * var(--n) * var(--size-s));
}

@keyframes hop {
  from {  max-height: 0 }
  to   {  max-height: 1rem }
}
</style>
