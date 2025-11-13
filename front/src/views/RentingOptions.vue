<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RentingOptions',
  computed: {
    ...mapGetters( 'meta', [ 'renting_options' ]),
  }
}
</script>
<template>
  <section :id="$id()">
    <h1>Renting Options</h1>
    <section>
      {{ renting_options }}
    </section>
  </section>
</template>
