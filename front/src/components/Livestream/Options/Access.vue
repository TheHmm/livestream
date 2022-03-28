<script>
import { mapState } from 'vuex'


// Accessbility menu. Options are imported from the store 
// but their value is computed from the route query. They 
// never committed to the store, only pushed to the router.
// They are only used to coomputed css classes in @/App

export default {

  name: 'Access',
  
  computed: {
    ...mapState( 'meta', [ 
      'ui' 
    ])
  },


  // Using the router as a store 😮

  methods: {
    get_option( key ) {
      return this.$route.query[key]
    },
    toggle( key ) {
      this.$router.push({
        query: {
          ...this.$route.query,
          // [ key ]: this.get_option( key ) ? undefined : true
          [ key ]: !this.get_option( key ) 
        }
      })
    }
  }
  
}
</script>


<template>
  <ul role="menu">
    <li 
      v-for="( option, key ) in ui"
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
        :title="option.label"
      >
        {{ option.label }}
      </label> 
    </li>
  </ul>
</template>
