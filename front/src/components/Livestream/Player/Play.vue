<script>

export default {

  name: 'PLay',

  props: {
    playing: Boolean
  },

  data() {
    return {
    }
  },

  computed: {
    label() {
      // return this.playing ? '▌▌' : 'play'
      return this.playing ? 'pause' : 'play'
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
