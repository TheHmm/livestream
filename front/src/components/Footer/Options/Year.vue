<script>
import { mapGetters } from 'vuex'

export default {

  name: 'Year',

  computed: {
    ...mapGetters( 'events', [
      'years'
    ]),

    desired_year() {
      return this.$route.query.year
    },

  },

  methods: {

    toggle( year ) {
      this.$router.push({
        query: { ...this.$route.query, year }
      })
    }
  }

}
</script>


<template>
  <ul role="menu">
    <li
      v-for="year in years"
      :key="year"
    >
      <input
        type="radio"
        :id="year"
        :checked="desired_year == year"
        @change="toggle( year )"
      />
      <label
        :for="year"
        :title="year"
      >
        {{ year }}
      </label>
    </li>
  </ul>
</template>
