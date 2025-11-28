<script>
import AgendaEvent from './AgendaEvent.vue'
export default {
  name       : 'AgendaList',
  components : { AgendaEvent },
  props      : { events: Array }
}
</script>

<template>
  <ul aria-label="Event archive">
    <AgendaEvent
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* display          : flex;
  flex-direction   : row;
  flex-wrap: wrap;
  justify-content  : stretch; */
  width            : 100%;
  gap: 1rem;
  /* margin: 1rem; */
  padding: 1rem;
  transition       :
    transform var(--very-slow) ease,
    background-color var(--very-slow) ease
  ;
}
</style>
