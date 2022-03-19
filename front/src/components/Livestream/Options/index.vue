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
        'access': {
          comp: 'Access',
          label: 'Accessibility',
          aria_label: 'Accessibility options',
        },
        'donate': {
          comp: 'Donate',
          label: 'Donate',
          aria_label: 'Donate to the Hmm'
        },
        'modes': {
          label: 'View modes',
          aria_label: 'View modes',
          comp: 'Modes'
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
      <label :for="key"> {{ tab.label }} </label>
      <hr>
      <ul>
        <Component :is="tab.comp" />
      </ul>
    </div>
    
<!--    <div
      id="emoji"
      class="tab"
    >
      <label for="emoji"> Emotes </label>
      <hr>
      <ul>
      </ul>
    </div> -->

  </div>
  
</template>

<style >

#options {
  display: flex;
  align-items: flex-end;
  margin-left: 0.5rem;
  max-height: 0;
  overflow: visible;
}

#options .tab {
  box-sizing: border-box;
  --back: var(--yellow);
  background: var(--back);
  box-shadow: var(--shadow-up);
}

#options .tab label {
  display: block;
  box-sizing: border-box;
  padding: 0.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
}
#options .tab#access label svg {
  height: 2rem;
}

#options .tab hr {
  border: unset;
  display: none;
}

#options .tab ul {
  box-sizing: border-box;
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 0;
  transition: max-height var(--fast) ease-in-out;
}
#options .tab ul li {
  padding: 0 0.5rem;
}
#options .tab ul li:first-of-type {
  border-top: 0.1rem solid var(--fore);
  padding-top: 0.5rem;
}
#options .tab ul li:last-of-type {
  padding-bottom: 0.5rem;
}
#options .tab:hover ul,
#options .tab:focus ul {
  max-height: 20rem;
}

</style>
