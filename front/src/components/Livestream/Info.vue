<script>

import { time } from '@/utils'

export default {

  name: 'Info',
  
  props: {
    
    event: { type: Object },
    status: { type: String }

  },

  computed: {

    // Basic event properties.

    title()     { return this.event.title },
    slug()      { return this.event.slug },


    // Time-related event properties

    in_past()   { return this.event.is.in_past() },
    in_future() { return this.event.is.in_future() },
    soon()      { return this.event.is.soon() },
    starts()    { return this.event.starts },
    ends()      { return this.event.ends },
    timestamp() { return time.human_format( this.starts ) }

  }
  
}
</script>

<template>
  <div
    :id="$id()"
    aria-label="event information"
  >

    <h3 aria-label="event time"> 
      <time :datetime="starts">
        {{ timestamp }}
      </time>
    </h3>

    <h2 id="event_title">{{ event.title }}</h2>

    <div aria-label="event summary">
      <p>{{ event.info }}</p>
    </div>

    <div aria-label="livestream status">
      <p role="status">status: {{ status }}</p>
    </div>

  </div>
</template>

<style scoped>
#info {
  box-sizing: border-box;
  max-width: var(--side-width);
  padding: 0 0.5rem;
  text-align: center;
}
</style>
