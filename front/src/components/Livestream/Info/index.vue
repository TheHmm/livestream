<script>

// Livestream / Event info card for event page


export default {
  name: 'Info',
  props: { event: Object },
  computed: {
    title()     { return this.event?.title },
    body()      { return this.event?.info || '' },
    starts()    { return this.event?.starts },
    timestamp() { return this.starts && this.$time.short_date_format( this.starts ) }
  }
}
</script>

<template>
  <div
    :id="$id()"
    aria-label="Event information"
  >
   <router-link
      custom
      :to="{ path: '/', query: $route.query }"
      v-slot="{ navigate }"
    >
      <input
        value="✕"
        class="close circle"
        name="close"
        type="button"
        @click.stop="navigate"
      />
    </router-link>
    <h3 aria-label="event time">
      <time :datetime="starts">
        {{ timestamp }}
      </time>
    </h3>
    <h1 id="event_title">
      {{ title }}
    </h1>
    <div
      v-if="body"
      aria-label="event summary"
      v-html="$md( body )"
    >
    </div>
  </div>
</template>

<style scoped>
#info {
  width       : var(--side-width);
  max-width   : var(--side-width);
  height      : 100%;
  text-align  : center;
}
#info input {
  position    : absolute;
  right       : 0;
  z-index     : 1;
}
#info h2,
#info h3 {
  margin-top  : 0;
}
#info div {
  font-weight : lighter;
}
</style>
