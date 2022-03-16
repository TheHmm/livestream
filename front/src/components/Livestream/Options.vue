<script>
import AccessibilityIcon from '../Utils/AccessibilityIcon.vue'

export default {

  name: 'Options',
  
  props: {
    
    modes: {
      type: Object
    }

  },

  components: {
    AccessibilityIcon
  }
  
}
</script>

<template>
  <div 
    :id="$id()"
    aria-label="livestream options"
  >
    
    <div
      id="access"
      class="tab"
    >
      <label for="access"> <AccessibilityIcon /> </label>
      <hr>
      <ul>
      </ul>
    </div>

    <div
      id="donate"
      class="tab"
    >
      <label for="donate"> Donate </label>
      <hr>
      <ul>
      </ul>
    </div>


    <div
      id="modes"
      class="tab"
    >
      <label for="modes"> View modes </label>
      <hr>
      <ul>
        <li 
          v-for="mode in modes"
          :key="mode.name"
          :value="mode.label"
        >
          <router-link 
            :to="{
              name: $route.name,
              query: { mode: mode.name }
            }"
          >
            {{ mode.label }}
          </router-link>
        </li>
      </ul>
    </div>

    <div
      id="emoji"
      class="tab"
    >
      <label for="emoji"> Emotes </label>
      <hr>
      <ul>
      </ul>
    </div>

  </div>
  
</template>

<style scoped>

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
  border-top: 0.1rem solid var(--fore);
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
