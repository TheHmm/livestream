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
          name: 'access',
          label: 'Accessibility',
          comp: 'Access',
          aria_label: 'Accessibility options',
        },
        {
          name: 'donate',
          label: 'Donate',
          comp: 'Donate',
          aria_label: 'Donate to the Hmm'
        },
        {
          name:  'modes',
          label: 'View modes',
          comp: 'Modes',
          aria_label: 'View modes',
        },
        {
          name: 'emoji',
          label: 'Emotes',
          comp: 'Emoji',
          aria_label: 'Emoji reactions',
        }
      ]
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
      />
      <div class="contents">
        <Component :is="tab.comp" />
      </div>
    </div>
  </div>
</template>

<style >

#options {
  display: flex;
  align-items: flex-end;
  overflow: visible;
}

#options .tab .contents ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
#options .tab .contents ul li {
  padding: 0 1rem;
}
#options .tab .contents ul li label,
#options .tab .contents ul li input {
  padding: 0;
  margin: 0;
}

/* #options .tab#access label svg {
  height: 2rem;
} */

.mobile #options {
  margin: unset;
  z-index: 1;
  max-height: 2.5rem;
}



</style>
