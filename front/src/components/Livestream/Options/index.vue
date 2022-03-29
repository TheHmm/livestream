<script>
import Title  from './Title.vue'
import Access from './Access.vue'
import Donate from './Donate.vue'
import Modes  from './Modes.vue'
import Emoji  from './Emoji/index.vue'
import { mapGetters } from 'vuex'


// Livestream options.

export default {

  name: 'Options',

  components: {
    Title,
    Access,
    Donate, 
    Modes,
    Emoji
  },


  // Our option tabs.

  data() {
    return {
      tabs: [
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
      ]
    }
  },



  computed: {
    
    // We used the longest label to generate properly
    // sized curved texts in the Title component

    longest() {
      return Math.max.apply( null, this.tabs.map( t => t.label.length ) )
    },

    ...mapGetters( 'events', [
      'highlight_donate'
    ])

  },

}
</script>

<template>
  <div 
    :id="$id()"
    :class="{ highlight_donate }"
    aria-label="livestream options"
  >
    <div 
      v-for="( tab, index ) in tabs"
      :id="tab.name"
      :ref="tab.name"
      :aria-label="tab.aria_label"
      :style="{ '--n': index }"
      class="tab"
    >
      <Title
        :tab="tab"
        :longest="longest"
      />
      <div class="contents">
        <Component :is="tab.comp" />
      </div>
    </div>
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

.mobile #options {
  margin         : unset;
  z-index        : 1;
  max-height     : var(--base-height);
  /* padding-left: ; */
  /* flex-wrap: wrap; */
  /* overflow-x     : scroll; */
}

.mobile #options .tab {
  margin-left    : calc( -3 * var(--size-s));
}
.mobile #options .tab:first-of-type {
  margin-left    : 0;
}

.mobile #options .tab:focus .contents,
.mobile #options .tab:focus-within .contents,
.mobile #options .tab:hover .contents {
  padding-bottom: var(--base-height)
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
