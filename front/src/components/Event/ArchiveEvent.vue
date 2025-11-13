<script>
import livestream from '@/utils/livestream'


// Event tab in homepage

export default {
  name: 'ArchiveEvent',
  props: {
    event : Object,
    i     : Number,
    n     : Number,
  },
  computed: {
    title()  { return this.event?.title },
    slug()   { return this.event?.slug },
    starts() { return this.event?.starts && this.$time.short_date_format( this.event.starts )},
    accent() { return this.event?.accent },
    info()   { return this.event?.info || "" },
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
      ...accent,
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
        <h1> {{ title }} </h1>
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
      </header>
      <section
        :title="title"
        @click="navigate"
      >
        <img
          v-if="cover"
          :src="cover"
          :alt="`Still from livestream ${ title }`"
        />
      </section>
    </router-link>
  </li>
</template>

<style scoped >

li::before {
  content          : unset;
}
li.event {
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
  max-height: 10rem;
}

li.event section {
  cursor           : pointer;
  width            : 100%;
  transition       : all var(--fast) ease;
  padding-top      : 0.5rem;
  max-height       : 2rem;
  overflow         : hidden;
}

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
  transition       : padding var(--fast) ease;
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
}

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
