<script>
import { mapGetters } from 'vuex'

export default {

  name: 'Modes',
  
  computed: {

    // We get the list of available streaming modes from the store
    // this list can be updated by HLS.js at any moment.

    ...mapGetters( 'livestream', [ 
      'modes' ,
      'default_mode',
    ]),

    current_mode() {
      return (
        this.$route.query?.mode && 
        this.modes[this.$route.query.mode] || 
        this.default_mode
      )
    }

  },

}
</script>

<template>
  <ul>
    <li 
      v-for="mode in modes"
      :key="mode.name"
      tabindex="0"
    >
      <router-link 
        :title="`Switch to ${ mode.label } streaming mode`"
        :to="{
          name: $route.name,
          query: { mode: mode.name }
        }"
      >
        {{ mode.label }}
      </router-link>
    </li>
  </ul>
</template>

<style scoped>

</style>
