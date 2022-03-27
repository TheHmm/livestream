<script>
import Title  from './Title.vue'
import Access from './Access.vue'
import Donate from './Donate.vue'
import Modes  from './Modes.vue'
import Emoji  from './Emoji/index.vue'


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


  // We used the longest label to generate properly
  // sized curved texts in the Title component

  computed: {
    longest() {
      return Math.max.apply( null, this.tabs.map( t => t.label.length ) )
    }
  }
  
}
</script>

<template>
  <div 
    :id="$id()"
    aria-label="livestream options"
  >
    <div 
      v-for="( tab, index ) in tabs"
      :id="tab.name"
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
  display     : flex;
  align-items : flex-end;
  overflow    : visible;
}

#options .tab:not(:first-of-type) {
  margin-left : -1rem;
}

#options .tab .contents >>> ul {
  margin: auto;
}

#options .tab .contents >>> ul li {
  display     : flex;
  align-items : center;
}
#options .tab .contents >>> ul li::before {
  content     : unset;
}

.mobile #options {
  margin      : unset;
  z-index     : 1;
  max-height  : var(--base-height);
}


</style>
