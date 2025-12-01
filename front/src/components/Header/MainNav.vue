<script>
import { RouterLink } from 'vue-router';
import routes from '../../router/routes'

export default {
  name: 'MainNav',
  components: {
  },
  computed: {
    nav_routes() {
      return routes.filter( r => r.meta?.in_main_nav )
    }
  }
}

</script>

<template>
  <nav :id="$id()">
    <ul>
      <li
        v-for="route in nav_routes"
        :class="{ selected: $route.name == route.name }"
      >
        <RouterLink :to="route.path">
          {{ route.name }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  flex-basis: 75%;
  flex-shrink: 0;
  width: 100%; 
}
ul {
  display: flex;
  gap: 1rem;
}
li {
  flex-basis: 1;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: var(--accent);
  border: var(--solid);
  border-radius: var(--radius);
  transition: color var(--fast) linear, background-color var(--fast) linear;
}
li.selected {
  background-color: var(--fore);
  color: var(--accent);
  /* border: ; */
}
li::before {
  content: '';
}
a,
a:hover,
a:active,
a:visited {
  padding: 0.5rem;
  width: 100%;
  text-align: center;
  border-radius: inherit;
  border: none;
  font-family: karrik;
  font-style: normal;
  color: inherit;
  white-space: pre;
}

.mobile ul {
  gap: 0.5rem;
}
.mobile li a  {
  padding: 0.25rem;
}
</style>
