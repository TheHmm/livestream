<script>
import Viewers from '@/components/Viewers/index.vue'
import THEINBETWEEN from '@/components/Utils/THEINBETWEEN.vue'
export default {
  name : 'Placeholder',
  components: { Viewers, THEINBETWEEN },
  props : { event: Object },
}
</script>

<template>
  <section id="placeholder_page">
    <THEINBETWEEN />
    <section v-if="event" v-html="$md(event.info)"></section>
    <Viewers v-if="event" />
  </section>
</template>

<style>
.event:has( #placeholder_page ) {
  padding: 0;
}
#placeholder_page {
  width: 100%;
  height: 100%;
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#placeholder_page section {
  margin-top: 2rem;
  padding: 1rem;
  max-width: min(29rem, 100%);
}
#placeholder_page section p {  
  color: var(--black);
  line-height: 1;
}
#placeholder_page section a {
  color: var(--blue);
}

</style>
