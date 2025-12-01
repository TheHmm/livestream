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

</style>
