<script>

export default {

  name: 'Mute',

  props: {
    muted: Boolean
  },

  data() {
    return {
    }
  },

  computed: {
    label() {
      return this.muted ? 'unmute' : 'mute'
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
