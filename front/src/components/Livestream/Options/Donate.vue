<script>
import config from '@/config'
import api from '@/api'

export default {

  name: 'Modes',

  data() {
    return {
      donations: [
        '3',
        '6',
        '9'
      ]

    }
  },

  methods: {
    label  : a => `${ a } euros`,
    href   : a => `${ config.api_url }/${ a }`,
    donate : a => api.meta.donate(a)
  }

}
</script>

<template>
  <li 
    v-for="amount in donations"
    :key="amount"
  >
    <a
      :title="`Donate ${ label( amount ) } to The Hmm`"
      @click="donate(a)"
    >
      {{ label( amount ) }}
    </a>
  </li>
</template>

<style scoped>

</style>
