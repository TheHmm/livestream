<script>

// Livestream / Event info card for event page


export default {
  name: 'Info',
  props: { event: Object },
  computed: {
    title()     { return this.event?.title },
    body()      { return this.$md( this.event?.info || '' ) },
    starts()    { return this.event?.starts },
    timestamp() { return this.starts && this.$time.short_date_format( this.starts ) }
  },
  mounted() {
    this.routerify_links()
  },
  methods: {

    routerify_links() {
      setTimeout(() => {
        const anchors = Array.from( document.querySelectorAll( '#info a' ) )
        anchors
        .filter( a => {
          const url = new URL( a.href )
          if ( url.hostname == location.hostname &&
               url.pathname == location.pathname ) {
            return a
          }
        })
        .map( a => a.onclick = e => {
          e.preventDefault()
          const parsed_route = this.get_route( a.href )
          this.$router.push({
            path: parsed_route.path,
            query: { ...this.$route.query, ...parsed_route.query }
          })
        })
      }, 500)
    },

    get_route( url ) {
      url = new URL( url )
      const path = url.pathname
      const query_string = url.search.substr(1)
      const query = {}
      query_string.split( "&" ).forEach( part => {
        if ( part ) {
          const item = part.split("=")
          query[item[0]] = decodeURIComponent(item[1])
        }
      })
      return { path, query }
    }
  }
}
</script>

<template>
  <div
    :id="$id()"
    aria-label="Event information"
  >
    <h3 aria-label="event time">
      <router-link
        custom
        :to="{ path: event.is_in_past ? '/archive' : '/', query: $route.query }"
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
      v-html="body"
    >
    </div>
  </div>
</template>

<style scoped>
#info {
  width       : var(--side-width);
  max-width   : var(--side-width);
  font-family: var(--font);
  height      : 100%;
  text-shadow: var(--text-outline);
}
#info input {
  /* position    : absolute;
  right       : 0;
  z-index     : 0; */
}
#info h1, #info h2 {
  font-family: inherit !important;
  font-size: 2rem;
}
#info h2,
#info h3 {
  margin-top  : 0;
}
#info h3 {
  display: flex;
  /* justify-content: center; */
}
#info h3 time {
  margin-left: 1rem;
}
#info div {
  font-weight : lighter;
}
.mobile #info div {
  display: none;
}
.mobile #info h1 {
  margin-block: 0rem;
}
.mobile #info h3 {
  margin-block: 0rem;
}
</style>
