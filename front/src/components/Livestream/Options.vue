<script>

export default {

  name: 'Options',
  
  props: {
    
    modes: {
      type: Object
    }

  }
  
}
</script>

<template>
  <div 
    :id="$id()"
    aria-label="livestream options"
  >
    <span> modes: </span>
    <ul id="modes">
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
  
</template>

<style scoped>
#options {
  display: flex;
}
#options ul#modes {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}
#options ul#modes li {
  margin-left: 0.5rem;
}
</style>
