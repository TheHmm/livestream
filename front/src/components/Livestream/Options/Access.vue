<script>
import { mapState } from 'vuex'

export default {

  name: 'Access',
  
  computed: {
    ...mapState( 'meta', [ 'ui' ] )
  },
  methods: {
    get_option( key ) {
      return this.$route.query[key]
    },
    toggle( key ) {
      this.$router.push({
        query: {
          ...this.$route.query,
          [ key ]: this.get_option( key ) ? undefined : true
        }
      })
    }
  }
  
}
</script>

<template>
  <ul role="menu">
    <li 
      v-for="( label, key ) in ui"
      :key="key"
      role="menuitemcheckbox"
    >
      <label
        :title="label"
        tabindex="0"
      >
        <input 
          type="checkbox"
          :checked="get_option( key )"
          @change="toggle( key )"
        />
        {{ label }}
      </label> 
    </li>
  </ul>
</template>

<style scoped>

</style>
