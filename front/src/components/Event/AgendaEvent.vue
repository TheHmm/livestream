<script>
import livestream from '@/utils/livestream'
export default {
  name: 'AgendaEvent',
  props: {
    event : Object,
    i     : Number,
    n     : Number,
  },
  computed: {
    title()  { return this.event?.title },
    slug()   { return this.event?.slug },
    starts() { return this.event?.starts && this.$time.short_date_format( this.event.starts )},
    styles() { return this.event?.styles },
    info()   { return this.event?.info || "" },
    protected() { return this.event?.password_protected },
    query()  { return this.$route.query },
    cover()  {
      let cover
      if ( this.event.recording
        && this.event.recording.status
        && this.event.recording.status == 'ready'
        ) {
        cover = livestream.mux.thumb_src( this.event.recording.playbackId, 10, 1920 )
       } else {
        const event_livestream = this.$store.getters['livestream/get_livestream_by_event'](this.event.documentId)
        if ( event_livestream?.status == 'active' ) {
          cover = livestream.mux.thumb_src( current_livestream.playbackId, 0, 1920 )
        }
      }
      return cover
    }
  },
}
</script>

<template>
  <li
    :class="$id()"
    :aria-label="title"
    :style="{
      ...styles,
      '--i': i,
      '--n': n,
    }"
  >
    <router-link
      custom
      :to="{ path: slug, query }"
      v-slot="{ navigate }"
    >
      <header
        :title="title"
        @click="navigate"
      >
        <p class="title"> {{ title }} </p>
        <p
          aria-label="event summary"
          class="summary"
          v-html="$mdi(info).replaceAll('<br>', ' ')"
        />
        <time
          aria-label="event start time"
          class="time"
          :datetime="starts"
        >
          {{ starts }}
        </time>
        <p v-if="protected">🔒</p>
      </header>
    </router-link>
  </li>
</template>

<style scoped >

li::before {
  content          : unset;
}
li.agendaevent {
  text-shadow: var(--text-outline);
  background-color: var(--back);
  font-family: var(--font);
  color: var(--fore);
  min-height: 25rem;
  flex-basis: 25%;
  /* width: calc( 100% / 4 ); */
  /* max-width: var(--side-width); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
  max-height: 10rem;
  border: var(--solid);
  border-radius: var(--radius);
}

li.agendaevent section {
  cursor           : pointer;
  width            : 100%;
  transition       : all var(--slow) linear;
  padding-top      : 0.5rem;
  max-height       : 2rem;
  overflow         : hidden;
}

li.agendaevent p.title {
  font-size: 2rem !important;
  font-weight: bold;
}

/* 
li:last-of-type section {
  padding-bottom   : var(--footer-height);
}

li.event:hover section {
  padding-bottom   : 10rem;
  max-height       : 10rem;
}


li.event section img {
  width : 100%;
  min-height: 10rem;
}

li.event header {
  cursor           : pointer;
  display          : flex;
  align-items      : baseline;
  width            : 100%;
  transition       : padding var(--fast) linear;
  gap              : 0.5rem;
}


li.event p {
}
li.event a {
  font-style       : unset;
}

li.event h1,
li.event .summary {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow         : hidden;
  text-overflow    : ellipsis;
}
li.event h1 {
  flex-basis       : 60%;
}
li.event .summary {
  flex-basis       : 30%;
}
li.event h1,
li.event p {
  margin-block     : 0;
}

li.event .time {
  margin-left      : auto;
  text-align       : right;
  flex-shrink      : 0;
} */

.mobile li.event header {
  display: block;
}
.mobile li.event .summary {
  display: none;
}

.mobile li:last-of-type section {
  padding-bottom   : 4rem;
}
.mobile li.event:hover section {
  padding-bottom   : unset;
  max-height       : 3rem;
}
.mobile li:last-of-type:hover section {
  padding-bottom   : 4rem;
}

</style>
