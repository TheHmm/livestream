<script>
import Event from './Event.vue'
export default {
  name       : 'EventList',
  components : { Event },
  props      : { events: Array }
}
</script>

<template>
  <ul aria-label="Event archive">
    <transition-group name="fly">
      <Event
        v-for="( event, index ) in events"
        :key="event.slug"
        :event="event"
        :i="index"
        :n="events.length - index"
      />
    </transition-group>
  </ul>
</template>

<style scoped>
ul {
  z-index          : 2;
  list-style       : none;
  padding          : 0;
  height           : 100%;
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
