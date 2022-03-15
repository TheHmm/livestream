<script>
import networking  from '@/networking'
import { mapGetters } from 'vuex'

export default {

  name: 'Network',

  computed: {
     ...mapGetters( 'networking', [
      'total_bytes_sent',
      'total_bytes_received',
      'total_bytes_transferred',
      'last_bytes_sent',
      'last_bytes_received'
    ]),
  },

  watch: {

    last_bytes_sent() {
      this.sent_has_changed = true
      setTimeout(() => {
        this.sent_has_changed = false
      }, 2000)
        
    },

    last_bytes_received() {
      this.received_has_changed = true
      setTimeout(() => {
        this.received_has_changed = false
      }, 2000)
        
    }
  },

  data() {
    return {
      sent_has_changed: false,
      received_has_changed: false
    }
  },

  methods: {
    format_bytes: networking.tools.format_bytes
  }

}

</script>

<template>
  <table 
    id="network"
    aria-label="network monitor"
  >

    <tr
      aria-label="bytes sent"
    >
      <td 
        id="total_bytes_sent_label"
      >
        total bytes sent
      </td>
      <td
        aria-labelledby="total_bytes_sent_label"
      >
        {{ format_bytes( total_bytes_sent ) }}
      </td>
      <td 
        :class="{ has_changed: sent_has_changed }"
        role="status"
        aria-label="last bytes sent"
      >
        {{ `↑ sent ${ format_bytes(last_bytes_sent?.bytes) } to ${ last_bytes_sent?.to }` }}
      </td>
    </tr>

    <tr
      aria-label="bytes received"
    >
      <td
        id="total_bytes_received_label"
      >
        total bytes received
      </td>
      <td
        aria-labelledby="total_bytes_received_label"
      >
        {{ format_bytes( total_bytes_received ) }}
      </td>
      <td 
        :class="{ has_changed: received_has_changed }"
        role="status"
        aria-label="last bytes received"
      > 
        {{ `↓ received ${ format_bytes(last_bytes_received?.bytes) } from ${ last_bytes_received?.from }` }}
      </td>
    </tr>

    <!-- <tr
      aria-label="bytes trasferred"
    >
      <td
        id="total_bytes_transferred_label"
      >
        total bytes transferred
      </td>
      <td
        aria-labelledby="total_bytes_transferred_label"
      >
        {{ format_bytes( total_bytes_transferred ) }}
      </td>
    </tr> -->

  </table>
</template>

<style scoped>


table {
  border-collapse: collapse;
  font-family: monospace;
}
table tr td {
  border: 1px solid black;
  padding: 0.1em 0.4em;
}
table tr td:nth-of-type(2) {
  text-align: right;
}
table tr td:nth-of-type(3) {
  padding-left: 0.75rem;
  border: none;
  opacity: 0;
  transition: opacity 0.5s ease-out;
}
table tr td.has_changed {
  animation: fade 2s ease-out;
  transition: opacity 0.5s ease-out;
}

@keyframes fade {
  0% { opacity: 0; }
  5% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}

</style>
