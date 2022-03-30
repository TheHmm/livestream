<script>

export default {
  name: 'Unmute',
}

</script>

<template>
  <div class="controls">
    <input
      type="button"
      :class="$id()"
      :value="$id()"
      :name="$id()"
      :title="$id()"
    />
  </div>
</template>

<style scoped>
.controls {
  position: absolute;
  width: 100%;
  height: 100%;
}
.controls::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--accent-lighter);
  opacity: 0.7;
}
</style>
