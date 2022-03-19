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
      <hr>
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
  max-height: 0;
  overflow: visible;
}

#options .tab {
  box-sizing: border-box;
  --back: var(--yellow);
  background: var(--back);
  box-shadow: var(--shadow-up);
}

#options .tab .title {
  display: block;
  box-sizing: border-box;
  padding: 0.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
}
/* #options .tab#access label svg {
  height: 2rem;
} */

#options .tab hr {
  border: unset;
  display: none;
}

#options .tab .contents {
  box-sizing: border-box;
  max-height: 0;
  max-width: 0;
  transition: 
    max-height var(--fast) ease-in-out,
    max-width var(--fast) ease-in-out
  ;
}

#options .tab .contents ul {
  box-sizing: border-box;
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 0.1rem solid var(--fore);
}

#options .tab .contents ul li {
  padding: 0 0.5rem;
}
#options .tab .contents ul li:first-of-type {
  padding-top: 0.5rem;
}
#options .tab .contents ul li:last-of-type {
  padding-bottom: 0.5rem;
}
#options .tab .contents ul li label,
#options .tab .contents ul li input {
  padding: 0;
  margin: 0;
}

#options .tab:hover .contents,
#options .tab:focus-within .contents,
#options .tab:focus .contents {
  max-height: 20rem;
  max-width: 12rem;
}

</style>
