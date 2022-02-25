<script>
import { network } from '../../utils'
import { mapGetters } from 'vuex'

export default {

  name: 'Header',

  computed: {
     ...mapGetters( 'network', [
      'total_bytes_sent',
      'total_bytes_received',
      'total_bytes_transferred',
    ] )
  },

  methods: {
    format_bytes: network.format_bytes
  }

}

</script>

<template>
  <header>

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

  </header>  
</template>

<style>

</style>
