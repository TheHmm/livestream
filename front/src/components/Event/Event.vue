  <script>
  export default {
    name: 'Event',
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
      info()   { return this.event?.info },
      cover()  { return this.event?.cover },
      query()  { return this.$route.query }
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
          >
            {{ info }}
          </p>
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

  li:last-of-type section {
    padding-bottom   : var(--footer-height);
    max-height       : var(--footer-height);
  }
  li.event {
    display: flex;
    flex-direction: column;
  }

  li.event:hover section {
    padding-bottom   : 10rem;
    max-height       : 12rem;
  }


  li.event section {
    cursor           : pointer;
    width            : 100%;
    transition       : all var(--fast) ease;
    padding-top: 0.5rem;
  }

  li.event section img {
    width : 100%;
  }

  li.event header {
    cursor           : pointer;
    display          : flex;
    align-items      : center;
    width            : 100%;
    transition       : padding var(--fast) ease;
  }

  li.event h1,
  li.event p {
    margin-inline    : 0.25rem;
    white-space      : nowrap;
  }

  li.event a {
    font-style       : unset;
  }

  li.event h1,
  li.event p {
    margin-block     : 0;
  }

  li.event .time {
    margin-left      : auto;
    min-width        : 10rem;
    text-align       : right;
  }


  li.event .summary {
    overflow         : hidden;
    text-overflow    : ellipsis;
  }

  </style>
