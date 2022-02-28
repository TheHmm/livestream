<script>
export default {

  name: 'Event',

  props: {
    event: {
      type: Object
    }
  },

  computed: {
    title()     { return this.event.title },
    slug()      { return this.event.slug },
    in_past()   { return this.event.is.in_past() },
    in_future() { return this.event.is.in_future() },
    soon()      { return this.event.is.soon() }
  },

}
</script>

<template>
  <li 
    v-if="event" 
    :class="[
      $id(),
      { in_past, in_future, soon }
    ]"
  >
    <router-link 
      :to="slug"
    >
      {{ title }}
    </router-link>
    <pre>{{ event }}</pre>
  </li>
</template>

<style scoped >

.in_past {
  opacity: 0.5;
}

.in_future {
  opacity: 0.2;
}

.soon {
  color: fuchsia;
  opacity: 1;
}

</style>
