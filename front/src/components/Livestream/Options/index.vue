<script>
import Access from './Access.vue'
import Donate from './Donate.vue'
import Modes  from './Modes.vue'

export default {

  name: 'Options',

  components: {
    Access,
    Donate, 
    Modes
  },

  data() {
    return {
      tabs: {
        access: {
          comp: 'Access',
          label: 'Accessibility',
          aria_label: 'Accessibility options',
        },
        donate: {
          comp: 'Donate',
          label: 'Donate',
          aria_label: 'Donate to the Hmm'
        },
        modes: {
          label: 'View modes',
          comp: 'Modes',
          aria_label: 'View modes',
        },
        emoji: {
          comp: 'Emoji',
          label: 'Emotes',
          aria_label: 'Emoji reactions',
        }
      }
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
      v-for="( tab, key ) in tabs"
      class="tab"
      tabindex="0"
      :id="key"
      :aria-label="tab.aria_label"
    >
      <label 
        class="title"
        :for="key"
      > 
        {{ tab.label }} 
      </label>
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
  margin-left: 1rem;
  /* flex-grow: 1; */
  overflow: visible;
}

#options .tab .contents ul {
  box-sizing: border-box;
  list-style: none;
  padding: 0;
  margin: 0;
}

#options .tab .contents ul li {
  padding: 0 0.5rem;
}
#options .tab .contents ul li:first-of-type {
  margin-top: 0.5rem;
}
#options .tab .contents ul li:last-of-type {
  margin-bottom: 0.5rem;
}
#options .tab .contents ul li label,
#options .tab .contents ul li input {
  padding: 0;
  margin: 0;
}

.mobile #options {
  margin: unset;
  z-index: 1;
  max-height: 2.5rem;
}



</style>
