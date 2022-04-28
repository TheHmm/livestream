
<script>

import Accent from '@/components/Utils/Accent.vue'

export default {

  name : 'AccentPage',

  components : {
    Accent,
  },


  // This component inherits only the event fron it's parent
  // and handles the rest independently.

  props : {
    event: Object,
  },

}
</script>

  
<template>
  <Chat />
</template> 


<style scoped>


</style>
