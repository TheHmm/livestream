<script>
import Title  from './Title.vue'
import About  from './About.vue'
import Access from './Access.vue'
import Donate from './Donate.vue'
import Year   from './Year.vue'
import Modes  from './Modes.vue'
import Emoji  from './Emoji/index.vue'
import { mapGetters } from 'vuex'


// Livestream options.

export default {

  name: 'Options',

  props : {
    desired_tabs: { type: Array }
  },

  components: {
    Title,
    About,
    Access,
    Donate,
    Year,
    Modes,
    Emoji
  },


  // Our option tabs.

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
          name       : 'donate',
          label      : 'Donate',
          comp       : 'Donate',
          aria_label : 'Donate to the Hmm'
        },
        {
          name       : 'year',
          label      : 'Choose a year',
          comp       : 'Year',
          aria_label : 'Choose a year'
        },
        {
          name       : 'modes',
          label      : 'View modes',
          comp       : 'Modes',
          aria_label : 'View modes',
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

    ...mapGetters( 'events', [
      'highlight_donate'
    ])

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
  <div
    :id="$id()"
    :class="{ highlight_donate }"
    aria-label="livestream options"
  >
    <transition-group
      name="tab_enter"
      appear
    >
    <div
      v-for="( tab, index ) in tabs"
      :key="tab.name"
      :id="tab.name"
      :ref="tab.name"
      :aria-label="tab.aria_label"
      :class="[ 'tab', { expanded } ]"
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
          v-if="tab.name == 'about' "
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
    </div>
    </transition-group>
  </div>
</template>

<style scoped>

@import '@/assets/css/tabs.css';

#options {
  display        : flex;
  align-items    : flex-end;
  overflow       : visible;
}

#options .tab {
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

#options .tab:not(:first-of-type) {
  margin-left    : calc( -1 * var(--size-s));
}

#options .tab:focus .contents,
#options .tab:focus-within .contents,
#options .tab:hover .contents {
  padding-bottom : 0.5rem;
}

#options .tab .contents >>> ul {
  margin         : auto;
}

#options .tab .contents >>> ul li {
  display        : flex;
  align-items    : center;
}
#options .tab .contents >>> ul li::before {
  content        : unset;
}

#options .tab#about {
  --back: var(--black);
  --fore: var(--white);
  max-width : var(--tab-width);
}

#options .tab#about header {
  position: sticky;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  z-index: 1;
}
#options .tab#about.expanded header {
  justify-content: flex-end;
}

#options .tab#about.expanded {
  --full-height: calc( 100vh - 8rem );
}

#options .tab#about.expanded .contents,
#options .tab#about.expanded:hover .contents,
#options .tab#about.expanded:focus .contents,
#options .tab#about.expanded:focus-within .contents {
  min-height: var(--full-height);
  min-width: calc( 100vw - 2rem );
  max-width: calc( 100vw - 2rem );
}

#options .tab#about {
}


.mobile #options {
  margin         : unset;
  z-index        : 1;
  max-height     : var(--base-height);
  /* --radius       : calc( 5rem + var(--base-height) ) 100%; */
  --radius       : calc( 5rem ) 100%;

  /* padding-left: ; */
  /* flex-wrap: wrap; */
  /* overflow-x     : scroll; */
}

.mobile #options .tab {
  margin-left    : calc( -3 * var(--size-s));
  /* position: absolute; */
  /* left: 15%; */
}
.mobile #options .tab:first-of-type {
  margin-left    : 0;
}
.mobile #options .tab:focus ,
.mobile #options .tab:focus-within ,
.mobile #options .tab:hover {
 margin-left    : calc( -2.5 * var(--n) * var(--size-s));
}

.mobile #options .tab:focus .contents,
.mobile #options .tab:focus-within .contents,
.mobile #options .tab:hover .contents {
  padding-bottom : var(--base-height);
  --width        : 12rem;
  min-width: var(--width);
  max-width: var(--width);
}

.chatpage #options #modes {
  display: none;
}

.mobile.chatpage #options .tab {
  margin-left    : calc( -1 * var(--size-s));
}
.mobile.chatpage #options .tab:first-of-type {
  margin-left    : 0;
}

.mobile.chatpage #options .tab:focus ,
.mobile.chatpage #options .tab:focus-within ,
.mobile.chatpage #options .tab:hover {
 margin-left    : calc( -1.5 * var(--n) * var(--size-s));
}

#options.highlight_donate #donate .contents {
  animation: hop 0.25s ease infinite alternate;
}
#options.highlight_donate #donate:hover .contents,
#options.highlight_donate #donate:focus-within .contents {
  animation: none;
}

@keyframes hop {
  from {  max-height: 0 }
  to   {  max-height: 1rem }
}

</style>
