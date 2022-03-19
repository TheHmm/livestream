<script>
import config from '@/config'

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
    label : a => `${ a } euros`,
    href  : a => `${ config.api_url }/${ a }`
  }

}
</script>

<template>
  <li 
    v-for="amount in donations"
    :key="amount"
  >
    <a
      :href="href( amount )"
      :title="`Donate ${ label( amount ) } to The Hmm`"
    >
      {{ label( amount ) }}
    </a>
  </li>
</template>

<style scoped>

</style>
