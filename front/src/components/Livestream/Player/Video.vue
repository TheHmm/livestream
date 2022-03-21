<script>

export default {

  name: 'Video',

  props: {
    
    },
  data() {
    return {
    }
  },

  computed: {
    current_time() {
      return time.time_format( time.now() - this.stream_start ) 
    }
  },  

  watch: {

  },

  created() {
  },

  async mounted() {
  },

  updated() {
  },

  beforeUnmount() {
  },


  methods: {
  }


}

</script>

<template>

  <time
    :id="$id()"
    :datetime="time" 
  >
    {{ current_time }}
  </time>

</template>

<style scoped>


#timer {
  max-height: 300px;
  overflow: scroll;
}

</style>
