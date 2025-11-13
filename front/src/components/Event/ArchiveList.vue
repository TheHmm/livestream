<script>

// Event list

import ArchiveEvent from './ArchiveEvent.vue'
export default {
  name       : 'ArchiveList',
  components : { ArchiveEvent },
  props      : { events: Array }
}
</script>

<template>
  <ul aria-label="Event archive">
    <ArchiveEvent
      v-for="( event, index ) in events"
      :key="event.slug"
      :event="event"
      :i="index"
      :n="events.length - index"
    />
  </ul>
</template>

<style scoped>
ul {
  z-index          : 2;
  list-style       : none;
  padding          : 0;
  min-height       : 100%;
  display          : flex;
  flex-direction   : column;
  justify-content  : flex-end;
  width            : 100%;
  transition       :
    transform var(--very-slow) ease,
    background-color var(--very-slow) ease
  ;
}
</style>
