<script>

// Livestream status indicator:
// - active      : livestream is running
// - idle        : livestream will run eventually
// - ready       : recording of livestream is available
// - unavailable : none of the above

export default {
  name: 'Status',
  props: { status: String },
}
</script>

<template>
  <div
    :id="$id()"
    aria-label="Livestream status"
  >
    <p role="status">
      {{ status }}
    </p>
  </div>
</template>

<style scoped>
#status {
  width           : 100%;
  height          : 100%;
  text-align      : center;
  display         : flex;
  align-items     : center;
  justify-content : center;
  border          : var(--dash) var(--fore);
}
</style>
