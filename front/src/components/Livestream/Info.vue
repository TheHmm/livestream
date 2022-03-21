<script>

import { time } from '@/utils'
import Network from '@/components/Header/Network.vue'

export default {
  
  name: 'Info',

  components: { 
    Network 
  },
  
  props: {
    
    event: { type: Object },

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
    timestamp() { return time.date_format( this.starts ) }

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

    <!-- <Network /> -->

  </div>
</template>

<style scoped>
#info {
  box-sizing: border-box;
  width: var(--side-width);
  max-width: var(--side-width);
  height: 100%;
  text-align: center;
}
</style>
