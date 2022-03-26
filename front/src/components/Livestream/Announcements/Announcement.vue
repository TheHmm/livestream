<script>

export default {

  name: 'Announcement',

  props: {
    announcement: Object 
  }
  
}
</script>


<template>
  <div 
    :class="$id()"
    :title="announcement?.title"
    tabindex="-1"
    v-html=" $md( announcement?.body || '' ) "
  />
</template>


<style scoped>

.announcement {
  --back           : var(--accent);
  background-color : var(--back);
  box-shadow       : var(--shadow);
  min-width        : var(--side-width);
  max-width        : var(--side-width);
  padding          : 0.5rem;
  margin           : 1rem;
  transition       : all 0.5s ease;
}
.announcement >>> p:first-of-type {
  margin-block-start: 0;
}
.announcement >>> p:last-of-type {
  margin-block-end: 0;
}

</style>
