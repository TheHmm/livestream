<script>
import { mapGetters } from 'vuex'
import networking     from '@/networking'


// This comoponent displays the netwrok activitiy
// of the application. Network activity is observed
// in: @/networking/watchers and then commited to:
// @/store/networking

export default {

  name: 'Network',

  computed: {
     ...mapGetters( 'networking', [
      'total_bytes_sent',
      'last_bytes_sent',
      'total_bytes_received',
      'last_bytes_received'
    ]),
  },


  // Logic to fade in and out the network updates

  watch: {

    last_bytes_sent() {
      this.sent_has_changed = true
      setTimeout( () => {
        this.sent_has_changed = false
      }, 2000)
        
    },

    last_bytes_received() {
      this.received_has_changed = true
      setTimeout( () => {
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
    :id="$id()"
    aria-label="network monitor"
  >

    <tr aria-label="bytes sent">
      <td
        class="value"
        aria-label="total bytes sent"
      >
        {{ format_bytes( total_bytes_sent ) }}
      </td>
      <td>
        sent
      </td>
      <td 
        role="status"
        aria-label="last bytes sent"
        :class="[ 'last', { has_changed: sent_has_changed } ]"
      >
        {{ `↑ sent ${ format_bytes( last_bytes_sent?.bytes ) } to ${ last_bytes_sent?.to }` }}
      </td>
    </tr>

    <tr aria-label="bytes received">
      <td
        class="value"
        aria-label="total bytes received"
      >
        {{ format_bytes( total_bytes_received ) }}
      </td>
      <td>
        received
      </td>
      <td 
        role="status"
        aria-label="last bytes received"
        :class="[ 'last', { has_changed: received_has_changed } ]"
      > 
        {{ `↓ received ${ format_bytes( last_bytes_received?.bytes ) } from ${ last_bytes_received?.from }` }}
      </td>
    </tr>

  </table>
</template>

<style scoped>


table {
  --n             : 6;
  --fore          : white;
  color           : var(--fore);
  border-collapse : collapse;
  font-family     : 'not-courier-sans', monospace;
  font-size       : 0.8rem;
  line-height     : 1;
  opacity         : 0;
  animation       : fade_in var(--enter) ease calc( 0.4s + var(--n) * 0.1s ) forwards;
}
table tr td {
  padding         : 0;
  white-space     : pre;
}
table tr td.value {
  text-align      : right;
}
table tr td.last {
  padding-left    : 0.25rem;
  max-width       : 0;
  overflow        : visible;
  opacity         : 0;
  transition      : opacity 0.5s ease-out;
}
table tr td.last.has_changed {
  animation       : fade 2s ease-out;
  transition      : opacity 0.5s ease-out;
}

@keyframes fade {
  0%   { opacity  : 0; }
  5%   { opacity  : 1; }
  90%  { opacity  : 1; }
  100% { opacity  : 0; }
}

@keyframes fade_in {
  from { opacity  : 0; }
  to   { opacity  : 1; }
}

</style>
