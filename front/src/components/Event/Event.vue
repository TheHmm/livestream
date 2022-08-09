  <script>
  export default {

    name: 'Event',

    props: {
      event: Object,
      i: Number,
      n: Number,
    },

    computed: {
      title()     { return this.event?.title },
      slug()      { return this.event?.slug },
      starts()    { return this.event?.starts && this.$time.short_date_format( this.event.starts )},
      accent()    { return this.event?.accent },
      info()      { return this.event?.info },
    },

  }
  </script>

  <template>


    <li
      :class="'event'"
      :style="{
        ...accent,
        '--i': i,
        '--n': n,
      }"
    >
      <router-link
        custom
        :to="{
          path: slug,
          query: $route.query
        }"
        v-slot="{
          navigate,
          href
        }"
      >
        <header
          :title="href"
          @click="navigate"
        >
          <h1>
            {{ title }}
          </h1>

          <p
            aria-label="event summary"
            class="summary"
          >
            {{ info }}
          </p>

          <p
            aria-label="event start time"
            class="time"
          >
            <time
              :datetime="starts"
            >
              {{ starts }}
            </time>
          </p>
        </header>
        <section>
          <img
            :src="event.cover"
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

  li.event p.time {
    margin-left      : auto;
    min-width        : 10rem;
    text-align       : right;
  }


  li.event .summary {
    overflow         : hidden;
    text-overflow    : ellipsis;
  }

  </style>
