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
  <ul role="menu">
    <li 
      v-for="( option, key ) in options"
      :key="key"
      role="menuitemcheckbox"
    >
      <label
        :title="option.label"
        tabindex="0"
      >
        <input 
          type="checkbox"
          :checked="option.value"
          @change="set_option({ 
            key: key, 
            value: !option.value 
          })"
        />
        {{ option.label }}
      </label> 
    </li>
  </ul>
</template>

<style scoped>

</style>
