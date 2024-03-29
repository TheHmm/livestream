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
    aria-label="Network monitor"
  >

    <tr aria-label="Bytes sent">
      <td
        role="status"
        aria-label="Last bytes sent"
        :class="[ 'last', { has_changed: sent_has_changed } ]"
      >
        <span>{{ `sent ${ format_bytes( last_bytes_sent?.bytes ) } to ${ last_bytes_sent?.to } ↑` }}</span>
      </td>
      <td
        class="value"
        aria-label="Total bytes sent"
      >
        <span>{{ format_bytes( total_bytes_sent ) }}</span>
      </td>
      <td aria-hidden="true">
        <span>sent</span>
      </td>
    </tr>

    <tr aria-label="Bytes received">
      <td
        role="status"
        aria-label="Last bytes received"
        :class="[ 'last', { has_changed: received_has_changed } ]"
      >
        <span>{{ `received ${ format_bytes( last_bytes_received?.bytes ) } from ${ last_bytes_received?.from } ↓` }} </span>
      </td>
      <td
        class="value"
        aria-label="Total bytes received"
      >
        <span>{{ format_bytes( total_bytes_received ) }}</span>
      </td>
      <td aria-hidden="true">
        <span>received</span>
      </td>
    </tr>

  </table>
</template>

<style scoped>


table {
  --n             : 6;
  --fore          : var(--accent);
  color           : var(--accent);
  position        : absolute;
  top             : calc( 1rem + var(--marquee-height) );
  right           : 1rem;
  border-collapse : collapse;
  font-family     : 'not-courier-sans', monospace;
  font-size       : 0.8rem;
  line-height     : 1;
  opacity         : 0;
  animation       : fade_in var(--enter) ease calc( 0.4s + var(--n) * 0.1s ) forwards;
  z-index         : 1;
  pointer-events  : none;
}
table tr td {
  padding         : 0;
  white-space     : pre;
}
table tr td * {
  background-color: var(--fore);
  color: var(--back);
  padding: 0 0.25rem;
  transition      : all var(--enter) ease;
}
table tr td.value {
  text-align      : right;
}
table tr td.last {
 /* padding-right   : 0.25rem; */
  text-align      : right;
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
