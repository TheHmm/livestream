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
    is_happening_now() { return this.event.is_happening_now },
    cover()  { return (
      this.event.livestream 
      && this.event.livestream?.status == 'active'
      && livestream.mux.thumb_src( this.event.livestream.playbackId, 20, 1920 )
    )}
  },
}
</script>

<template>
  <li
    :class="[ $id(), { is_happening_now, has_cover: cover && true } ]"
    :aria-label="title"
    :style="{
      ...styles,
      '--i': i,
      '--n': n,
      '--cover-url' : `url(${ cover })`,
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
        <p v-if="is_happening_now" class="live_now_text">Live now!</p>
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

<style scoped>
.title {
  cursor: pointer;
}
.summary {
  display: -webkit-box;
  max-width: 20rem;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden; 
  margin-inline: auto;
}
.live_now_text, 
.is_happening_now {
  border: 2.5px dashed;
}
p.live_now_text {
  color: var(--back);
  background-color: var(--fore);
  font-style: italic;
  width: max-content;
  margin: auto;
  padding: 0.5rem;
  border-radius: var(--radius);
}
.has_cover::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  height: 100%; width: 100%;
  background-image: var(--cover-url);
  background-position: center;
  background-size: cover;
  opacity: 0.5;
  filter: grayscale(1);
}
.has_cover {
  overflow: hidden; 
}
</style>
