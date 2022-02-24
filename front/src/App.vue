<script>

import { RouterLink, RouterView } from 'vue-router'
import { mapActions } from 'vuex'
import { useMeta } from 'vue-meta'

export default {

  name: 'App',

  setup() {
    useMeta({
      base: { href: '/vue-router', target: '_blank' },
      charset: 'utf8',
      title: 'My Title',
      // description: 'The Description',
      // og: {
      //   title: 'Og Title',
      //   description: 'Bla bla',
      //   image: [
      //     'https://picsum.photos/600/400/?image=80',
      //     'https://picsum.photos/600/400/?image=82'
      //   ]
      // },
      // twitter: {
      //   title: 'Twitter Title'
      // },
      // noscript: [
      //   { tag: 'link', rel: 'stylesheet', href: 'style.css' }
      // ],
      // otherNoscript: {
      //   tag: 'noscript',
      //   'data-test': 'hello',
      //   children: [
      //     { tag: 'link', rel: 'stylesheet', href: 'style2.css' }
      //   ]
      // },
      // body: 'body-script1.js', // TODO: fix
      // htmlAttrs: {
      //   amp: true,
      //   lang: ['en']
      // },
      // bodyAttrs: {
      //   class: ['theme-dark']
      // },
    })
  },


  components: { 
    RouterLink, 
    RouterView 
  },

  methods: {
    ...mapActions([
      'getMeta',
      'getLivestream',
    ]),
    ...mapActions( 'events', [
      'get_events',
      'get_event'
    ]),
    ...mapActions( 'livestream', [
      'get_livestream',
    ])
  },
  
  // async created() {

    // const meta =  await this.getMeta()
    // console.log(meta)

    // const livestream =  await this.get_livestream()
    // console.log(livestream)

    // const events =  await this.get_events()
    // console.log(events)

    // const test =  await this.get_event('test')
    // console.log(test)

  // }
}

</script>

<template>
  <header>

    <div class="wrapper">

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style>
@import '@/assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

</style>
