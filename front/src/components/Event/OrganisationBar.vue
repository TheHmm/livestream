<script>
import { mapGetters } from 'vuex'
export default {
  name: 'OrganisationBar',
  computed: {
    ...mapGetters( 'events', [
      'organisations'
    ]),
    desired_org() {
      return this.$route.query.org
    },
  },
  methods: {
    toggle( org ) {
      if ( this.desired_org == org ) {
        org = undefined
      }
      this.$router.push({
        query: { ...this.$route.query, org }
      })
    }
  }
}
</script>
<template>
  <ul role="menu">
    <li
      v-for="{ slug, Name } in organisations"
      role="menuitem"
      :key="slug"
    >
      <input
        type="checkbox"
        :id="slug"
        :checked="desired_org == slug"
        @change="toggle( slug )"
      />
      <label
        :for="slug"
        :title="Name"
      >
        {{ Name }}
      </label>
    </li>
  </ul>
</template>
<style scoped>
ul {
  display: flex;
  gap: 0.5rem;
}
li {
  display: flex;
}
li input {
  width: 0;
}
li input[type="checkbox"] + label::before,
li input[type="checkbox"]:checked + label::after {
  content: none;
}
li::before {
  content: none;
}
li input[type="checkbox"] + label {
  border: var(--solid);
  border-radius: var(--radius);
  padding: 0.125rem  0.5rem;
  user-select: none;
  background-color: var(--white);
}
li input[type="checkbox"]:checked + label {
  background-color: var(--yellow);
}
</style>
