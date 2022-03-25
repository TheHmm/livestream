<script>

export default {

  name: 'Volume',

  props: {
    direction: { type: String }
  },

  data() {
    return {
    }
  },

  computed: {
    label() {
      return 'volume ' + this.direction
    }
  },  
}

</script>

<template>
  <input
    type="button"
    :class="$id()"
    :value="label"
    :name="label"
    :title="label"
  />
</template>

<style scoped>

</style>
