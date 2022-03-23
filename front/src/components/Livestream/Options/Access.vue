<script>
import { mapState } from 'vuex'

export default {

  name: 'Access',
  
  computed: {
    ...mapState( 'ui', [ 'options' ] )
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
      v-for="( label, key ) in options"
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
