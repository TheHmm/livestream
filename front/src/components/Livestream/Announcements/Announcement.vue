<script>
export default {
  name: 'Announcement',
  props: {
    announcement: { type: Object }
  }
}
</script>

<template>
  <div 
    :class="$id()"
    :title="announcement.title"
    tabindex="-1"
    v-html=" $md( announcement.body ) "
  >
  </div>
</template>

<style scoped>

.announcement {
  --side-width: 20vw;
  --n: 1;
  --back: var(--accent);
  background-color: var(--back);
  box-shadow: var(--shadow);
  transition: 
    box-shadow var(--fast) ease
  ;
  min-width: var(--side-width);
  max-width: var(--side-width);
  transform: translateX(calc(var(--side-width) * -2 ));
  animation: enter var(--enter) ease calc( var(--n) *  0.1s) forwards;
  padding: 0.5rem;
}
.announcement >>> p:first-of-type {
  margin-block-start: 0;
}
.announcement >>> p:last-of-type {
  margin-block-end: 0;
}

.announcement:hover,
.announcement:focus {
  --shadow-size: 0.5rem;
  opacity: 1;
}

@keyframes enter {
  from { transform: translateX(calc(var(--side-width) * -2)); }
  to { transform: translateX(0); }
}
</style>
