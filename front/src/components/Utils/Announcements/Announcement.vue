<script>
export default {
  name: 'Announcement',
  props: { announcement: Object }
}
</script>

<template>
  <div
    :class="$id()"
    :title="announcement?.title"
    :aria-label="`Announcement: ${ announcement?.title }`"
    tabindex="-1"
    v-html=" $md( announcement?.body || '' ) "
  />
</template>


<style scoped>

.announcement {
  /* --back           : var(--accent); */
  background-color : var(--back);
  /* box-shadow       : var(--shadow); */
  border: var(--solid);
  text-shadow: var(--text-outline);
  min-width        : var(--side-width);
  max-width        : var(--side-width);
  padding          : 0.5rem;
  margin           : var(--size-s);
  outline: var(--outline);
  transition       : all 0.5s ease;
}
.announcement :deep(p:first-of-type) {
  margin-block-start: 0;
}
.announcement :deep(p:last-of-type) {
  margin-block-end: 0;
}
.mobile .announcement {
  min-width        : 90vw;
  max-width        : 100vw;
}

</style>
