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
    <li id="add_yours">
      <RouterLink to="/renting-options">
        Add yours!
      </RouterLink>
    </li>
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

ul:has(> :last-child:nth-child(1)) {
  grid-template-columns: repeat(1, 1fr);
}
ul:has(> :last-child:nth-child(2)) {
  grid-template-columns: repeat(2, 1fr);
}
ul:has(> :last-child:nth-child(3)) {
  grid-template-columns: repeat(3, 1fr);
}

li::before {
  content          : unset;
}
li {
  text-shadow: var(--text-outline);
  background-color: var(--back);
  font-family: var(--font);
  color: var(--fore);
  min-height: 25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
  max-height: 25rem;
  border: var(--solid);
  border-radius: var(--radius);
}

li section {
  cursor           : pointer;
  width            : 100%;
  transition       : all var(--slow) linear;
  padding-top      : 0.5rem;
  max-height       : 2rem;
  overflow         : hidden;
}
li :deep(p.title) {
  font-size: 2rem;
  font-weight: bold;
}
li#add_yours {
  border: 2px dashed;
}
.mobile li {
  min-height: 8rem;
}
.mobile ul {
  gap: 0.5rem;
  padding: 0.5rem;
  grid-template-columns: repeat(1, 1fr);
}
.mobile ul li:last-of-type {
  margin-bottom: var(--footer-height);
}
</style>
