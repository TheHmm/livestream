<script>
import Title  from './Title.vue'
import Access from './Access.vue'
import Donate from './Donate.vue'
import Modes  from './Modes.vue'
import Emoji  from './Emoji/index.vue'

export default {

  name: 'Options',

  components: {
    Title,
    Access,
    Donate, 
    Modes,
    Emoji
  },

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
      class="tab"
      tabindex="0"
      :id="tab.name"
      :aria-label="tab.aria_label"
      :style="{ '--n': index }"
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

/* #options .tab {
  border-top-left-radius  : 4.5em 100%;
  border-top-right-radius : 4.5em 100%;
} */

#options .tab:not(:first-of-type) {
  margin-left : -1rem;
}

.mobile #options {
  margin      : unset;
  z-index     : 1;
  max-height  : 2.5rem;
}



.mobile #options .tab:hover .contents,
.mobile #options .tab:focus-within .contents,
.mobile #options .tab:focus .contents {
  min-width   : 10rem;
}


</style>
