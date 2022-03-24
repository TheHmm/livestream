<script>
import { mapState } from 'vuex'

export default { 

  name:  "Error" ,

  computed: {

    ...mapState( 'ui', [ 'error' ]),

    title() {
      return this.$route.query.type 
    },

    traces() {
        return this.error?.traces
    }
  }

}
</script>

<template>

  <section>
    <h3>Error: {{ title }}</h3>
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
  </section>

</template>

<style scoped>
section h3 {
  color: var(--accent);
  font-weight: normal;
  /* text-align: center; */
  margin: auto;
  margin-top: 10%;
  margin-bottom: 1rem;
}
section table td {
  color: var(--accent);
}
section table tr td.arrow {
  max-width: 3rem;
}
section table tr td.caller {
  max-width: 14rem;
  padding-right: 0rem;
}
section table tr td p {
  margin: 0 ;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
section table tr td p a {
  background-color: var(--accent) ;
  color: var(--back);
  padding: 0 0.25rem;
}
</style>
