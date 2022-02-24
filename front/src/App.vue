<script>

import { RouterLink, RouterView } from 'vue-router'
import { useMeta } from 'vue-meta'
import { mapGetters } from 'vuex'
import { network } from './utils'
import api from './api'

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
      //   { tag: 'link', href: 'stylesheet', href: 'style.css' }
      // ],
      // otherNoscript: {
      //   tag: 'noscript',
      //   'data-test': 'hello',
      //   children: [
      //     { tag: 'link', href: 'stylesheet', href: 'style2.css' }
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

  computed: {
    ...mapGetters( 'network', [
      'total_bytes_sent',
      'total_bytes_received',
      'total_bytes_transferred'
    ] )
  },

  methods: {
    format_bytes: network.format_bytes
  },

  async created() {

    const 
      scripts = document.querySelectorAll('script'),
      styles = document.querySelectorAll('link')

    try {
      await api.assets.head( 'index.html' )
    } catch (err) {
      console.log(err)
    }

    for (const script of scripts) {
      if (script.src && !script.src.includes('@')) {
        try {
          await api.assets.head( script.src )
        } catch (err) {
          console.log(err)
        }
      }
    }

     for (const style of styles) {
      if (style.href && !style.href.includes('@')) {
        try {
          await api.assets.head( style.href )
        } catch (err) {
          console.log(err)
        }
      }
    }


  }


}

</script>

<template>
  <header>

    <div class="wrapper">
      <h1>The Hmm Livestream</h1>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
      <br>
      <table id="network">
        <tr>
          <td>total bytes sent</td>
          <td>{{ format_bytes( total_bytes_sent ) }}</td>
        </tr>
        <tr>
          <td>total bytes received</td>
          <td>{{ format_bytes( total_bytes_received ) }}</td>
        </tr>
        <tr>
          <td>total bytes transferred</td>
          <td>{{ format_bytes( total_bytes_transferred ) }}</td>
        </tr>
      </table>
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
nav a {
  margin-right: 1em;
}

table {
  border-collapse: collapse;
}
table tr td {
  border: 1px solid black;
  padding: 0.1em 0.4em;
}
table tr td:nth-of-type(2) {
  text-align: right;
}

</style>
