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
      'event',
      $id(),
      { in_past, in_future, soon }
    ]"
  >

    <router-link 
      :to="slug"
    >
      {{ title }}
    </router-link>

    <!-- <pre>{{ event }}</pre> -->
    <p 
      aria-label="event start time"
    >
      <time>{{ event.starts }}</time>
    </p>
    <p
      aria-label="event summary"
      class="summary"
    >
      {{ event.info }}
    </p>
  </li>
</template>

<style scoped >

li {
  border: 1px solid;
  padding: 1rem;
  margin-bottom: 1rem;
}

li p {
  margin: 0;
}

li.in_past {
  opacity: 0.5;
}

li.in_future {
  opacity: 0.2;
}

li.soon {
  color: fuchsia;
  opacity: 1;
}

li .summary {
  /* max-width: 10rem; */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

</style>
