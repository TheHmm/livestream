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
    >
      <input 
        type="checkbox"
        :id="key"
        :checked="get_option( key )"
        @change="toggle( key )"
      />
      <label  
        :for="key" 
        :title="label"
      >
        {{ label }}
      </label> 
    </li>
  </ul>
</template>

<style scoped>

</style>
