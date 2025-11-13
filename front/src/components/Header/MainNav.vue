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
  background-color: var(--white);
  border: var(--solid);
  color: var(--black);
  border-radius: var(--radius);
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
  color: var(--black);
  border: none;
  font-family: karrik;
  font-style: normal;
}
</style>
