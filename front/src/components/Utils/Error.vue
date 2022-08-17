<script>
import { mapState } from 'vuex'

export default {

  name:  "Error" ,

  data() {
    return {
      messages: {
        404: `The page you are looking for could not be found.`,
        500: `Internal server error. Please contact [Karl](mailto:bonjour@moubarak.eu).`
      }
    }
  },

  computed: {

    ...mapState( 'meta', [ 'error' ]),

    title() {
      return this.error.message
    },

    traces() {
      return this.error?.traces
    },

    message() {
      return this.messages[ Object
        .keys( this.messages )
        .find( k => this.title.includes( k ) )
      ]
    }

  },

}
</script>

<template>
  <h3>Error: {{ title }}.</h3>
  <p v-html="$mdi( message || '' )"></p>
  <table>
    <tr v-for="trace in traces">
      <td
        class="arrow"
      >
        ->
      </td>
      <td
        :title="trace[0]"
        class="caller"
      >
        <p>
          <a
            target="_blank"
            :title="trace[1]"
            :href="trace[1]"
          >
            {{ trace[0] }}
          </a>
        </p>
      </td>
    </tr>
  </table>
</template>

<style scoped>
h3 {
  color: var(--accent);
  font-weight: normal;
  margin: auto;
  margin-bottom: var(--size-s);
  font-size: var(--size-s);
}
table td {
  color: var(--accent);
}
table tr td.arrow {
  max-width: 3rem;
}
table tr td.caller {
  max-width: 14rem;
  padding-right: 0rem;
}
table tr td p {
  margin: 0 ;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
table tr td p a {
  background-color: var(--accent) ;
  color: var(--back);
  padding: 0 0.25rem;
}
</style>
