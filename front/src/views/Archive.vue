<script>
import store     from '@/store'
import _throw    from '@/utils/throw'
import ArchiveList from '../components/Event/ArchiveList.vue'
import OrganisationBar from '../components/Event/OrganisationBar.vue'
import Preview from '../components/Event/Preview.vue'
export default {
  name: 'Archive',
  components: { 
    OrganisationBar,
    Preview,
    ArchiveList,
  },
  async setup() {
    try {
      await store.dispatch( 'events/get_past_events' )
    } catch ( error ) {
      _throw( error )
      throw error
    }
  },
  computed: {
    year() {
      return this.$route.query.year
    },
    desired_org() {
      return this.$route.query.org
    },
    events() {
      return store.getters[ 'events/get_past_events' ].filter( e => {
        if ( this.desired_org ) {
          return e.organisation && e.organisation.slug == this.desired_org
        } else {
          return true
        }
      })
    },
    events_by_year() {
      const events_by_year = []
      this.events.map( e => {
        const year = this.$time.get_year( e.starts )
        const group = events_by_year.find( g => g.year == year )
        if ( group ) {
          group.events.push( e )
        } else {
          events_by_year.push({ year, events: [ e ] })
        }
      })
      return events_by_year.sort( ( a, b ) => a.year < b.year )
    },
  },
}
</script>
<template>
  <section :id="$id()">
    <header id="subheader">
      <OrganisationBar />
      <Preview />
    </header>
    <h2 class="spacer"></h2>
    <section v-for="{ events, year } of events_by_year">
      <h2>{{  year  }}</h2>
      <ArchiveList
        :events="events"
      />
    </section>
  </section>
</template>
<style scoped>
h2 {
  font-size: 12rem;
  font-weight: lighter;
  margin: 0;
  margin-inline: 1rem;
  position: sticky;
  top: calc( 3.5rem + var(--header-height));
  pointer-events: none;
  z-index: 10;
}
section .spacer {
  height: calc( 100vh - ( var(--header-height) + 3rem + 1.5ch) );
}
#archive {
  padding: 0;
  margin-top: 1rem;
}
#subheader {
  margin-inline: 1rem;
  position: sticky;
  /* top: 0rem; */
  top: calc( var(--header-height) + 1rem);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 3;
}
.mobile #archive {
  margin-top: 0.5rem;
}
.mobile #subheader {
  top: 0.5rem;
  margin-inline: 0.5rem;
}

.mobile section .spacer {
  height: calc( 100vh - ( var(--header-height) + 9rem + 1.5ch) );
}
.mobile h2 {
  font-size: 6rem;
  margin-inline: 0.5rem;
  margin-top: 1rem;
}
</style>
