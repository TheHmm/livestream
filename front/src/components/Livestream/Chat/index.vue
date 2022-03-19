<script>
import { mapGetters } from 'vuex'

export default {

  name: 'Chat',
  
  components: {
  },

  computed: {

    ...mapGetters( 'messages', [ 
      'messages_array',
    ]),

  },

}
</script>

<template>
  <div :id="$id()">
  </div>
</template>

<style scoped>

#chat {
}

</style>
