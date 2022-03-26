<script>

import Network from '@/components/Header/Network.vue'

export default {
  
  name: 'Info',

  components: { 
    Network 
  },
  
  props: {
    event: Object,
  },

  computed: {

    // Basic event properties.

    slug()      { return this.event.slug },
    title()     { return this.event.title },
    body()      { return this.event.info || '' },


    // Time-related event properties

    in_past()   { return this.event.is.in_past() },
    in_future() { return this.event.is.in_future() },
    soon()      { return this.event.is.soon() },
    starts()    { return this.event.starts },
    ends()      { return this.event.ends },
    timestamp() { return this.$time.date_format( this.starts ) }

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
    <h2 id="event_title">{{ title }}</h2>
    <div 
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

#info h2,
#info h3 {
  margin-top  : 0;
}

#info div {
  font-weight : lighter;
}

</style>
