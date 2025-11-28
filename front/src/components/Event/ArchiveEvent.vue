<script>
import config from '@/config'
import { mapActions } from 'vuex'
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
    styles() { return this.event?.styles },
    info()   { return this.event?.info || "" },
    org() { return this.event.organisation },
    org_logo_src() { return this.org && config.api_img_url + this.org?.Logo?.formats?.thumbnail?.url },
    protected() { return this.event?.password_protected },
    query()  { return this.$route.query },    
    mobile()  { return this.$store.state.meta.mobile },
  },
  created() {
    this.mousemove = this.$throttle( this.set_preview_time, 125 )
  },  
  methods: {
    ...mapActions( 'events', [
      'set_preview_event',
      'set_preview_time'
    ])
  }
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
      :to="{ path: slug, query }"
      @mouseenter.prevent="set_preview_event( slug )"
      @mouseleave.prevent="set_preview_event( undefined )"
      @mousemove="mousemove"
    >
      <span
        aria-hidden="true"
        class="organisation_logo"
      >
        <img :src="org_logo_src" />
      </span>
      <span v-if="mobile">
        <span
          aria-label="event organiser"
          class="organisation_name"
        >
          {{ org?.Name }}
        </span>
        <span class="event_title"> {{ title }} </span>
      </span>
      <span
        aria-label="event organiser"
        class="organisation_name"
        v-if="!mobile"
      >
        {{ org?.Name }}
      </span>
      <span class="event_title" v-if="!mobile"> {{ title }} </span>
      <p v-if="protected">🔒</p>
      <time
        aria-label="event start time"
        class="time"
        :datetime="starts"
      >
        {{ starts }}
      </time>
    </router-link>
  </li>
</template>

<style scoped >

li::before {
  content: unset;
}
li {
  margin:1rem;
  margin-bottom: 0;
}
li a {
  background-color: var(--back);
  text-shadow: var(--text-outline);
  font-family: var(--font);
  border-radius: var(--radius);
  border: var(--solid);
  width: 100%;
  padding: 0.5rem;
  max-height: 4rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-style: unset;
}
li a .organisation_logo {
  border-radius: 3rem;
  height: 3rem;
  max-width: 3rem;
}
li a .organisation_logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
li a .organisation_name {
  max-width: 15rem;
}
li a .event_title {
  max-width: 20rem;
}
li span {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
li span {
  flex-basis: 40%;
}
li .time {
  margin-left      : auto;
  text-align       : right;
  flex-shrink      : 0;
}
li:last-of-type {
  margin-bottom: var(--footer-height);  
}
li:first-of-type a {
  border-top: var(--solid);
}
li a:hover {
  border-bottom: var(--solid);
  --fore: var(--white);
  --back: var(--accent);
}
.mobile li {
  margin: 0.5rem;
  margin-bottom: 0;
}
.mobile li a {
  padding: 0.25rem;
  gap: 0.25rem;
  /* display: block; */
  /* flex-wrap: wrap; */
}
.mobile li a .organisation {
  /* display: none; */
}


</style>
