<script>
export default {
  name: 'DynamicLogo',
  computed: {
    tagline() { return this.$store.state.meta.tagline }
  }
}
</script>

<template>
  <div :id="$id()">
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path id="circle" fill="none" stroke-width="4" stroke="black" d="
          M 10, 50
          a 40,40 0 1,1 80,0
          a 40,40 0 1,1 -80,0
        " />
    <text>
      <textPath id="textPath" href="#circle">{{ tagline }}</textPath>
    </text>
  </svg>
  </div>
</template>

<style scoped>
</style>
