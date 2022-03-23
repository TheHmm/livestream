<script>

import { mapMutations, mapState } from 'vuex'

import Header  from './components/Header/index.vue'
import Footer  from './components/Footer/index.vue'
import Loading from './components/Utils/Loading.vue'

export default {

  name: 'App',

  components: { 
    Header,
    Footer,
    Loading
  },

  data() {
    return {
      meta: null,
    }
  },

  computed: {
    ...mapState( 'ui', [
      'mobile',
      'options'
    ]),
    access() {
      return Object
      .keys( this.options )
      .reduce( ( acc, key ) => ( 
        { ...acc, [key]: this.$route.query[key] } 
      ), {} )
    }
  }, 

  methods: {
    ...mapMutations( 'ui', [ 'SET_MOBILE' ] ),
    check_if_mobile() {
      return window.innerWidth < 700
    },   
  },

  created() {
    this.SET_MOBILE( this.check_if_mobile() )
    window.onresize = () => {
      this.SET_MOBILE( this.check_if_mobile() )
    }
  },


  async mounted() {  
    try {
      this.meta = await this.$store.dispatch( 'ui/get_meta' )
    } catch ( error ) {
      console.error(error)
      this.$router.push('404')
    }
  },

}

</script>

<template>

  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component 
        v-if="meta" 
        :is="Component" 
        :class="{ 
          mobile, 
          ...access
        }"
      />
      <loading v-else />
    </transition>
  </router-view>

</template>


<style>

/* Base styles for the whole app */

@import '@/assets/base.css';

.fade-leave-active {
  opacity: 1;
  animation: leave var(--enter) ease 3s forwards;
}

@keyframes leave {
  from { opacity: 1; }
  to { opacity: 0; }
}

</style>
