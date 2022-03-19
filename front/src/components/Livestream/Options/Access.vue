<script>
import { mapState, mapActions } from 'vuex'

export default {

  name: 'Access',
  
  computed: {
    ...mapState( 'ui', [ 'options' ] )
  },
  methods: {
    ...mapActions( 'ui', [ 'set_option' ] ),
  }
  
}
</script>

<template>
  <li 
    v-for="( option, key ) in options"
    :key="key"
  >
    <label
      :title="option.label"
    >
      <input 
        type="checkbox"
        v-bind="option.value"
        @change="set_option({ 
          key: key, 
          value: !option.value 
        })"
      />
      {{ option.label }}
    </label> 
  </li>
</template>

<style scoped>

</style>
