<script>
import { mapGetters } from 'vuex'


// Accessbility menu. Options are imported from the store 
// but their value is computed from the route query. They 
// never committed to the store, only pushed to the router.
// They are only used to coomputed css classes in @/App

export default {

  name: 'Access',
  
  computed: {
    ...mapGetters( 'meta', [ 
      'ui',
      'get_default_value'
    ])
  },


  // Using the router as a store 😮

  methods: {


    get_value( key ) {
      // return this.$route.query[key]
      if ( this.$route.query[key] ) {
        if ( this.$route.query[key] == 'true' ) {
          return true
        } else {
          return false
        }
      } else {
        return this.get_default_value(key)
      }
    },
    toggle( key ) {
      this.$router.push({
        query: {
          ...this.$route.query,
          // [ key ]: this.get_value( key ) ? undefined : true
          [ key ]: !this.get_value( key )
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
        :checked="get_value( key )"
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
