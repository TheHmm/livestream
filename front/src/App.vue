<script>

import { mapMutations, mapState } from 'vuex'
import _throw from '@/router/throw'
import Fallback from './views/Fallback.vue'
import {logger} from '@/utils'

export default {

  name: 'App',

  components: { 
    Fallback
  },

  data() {
    return {
      meta: null,
    }
  },

  computed: {
    ...mapState( 'meta', [
      'mobile',
      'ui'
    ]),
    ...mapState( 'viewers', [
      'uuid',
    ]),
    access() {
      return Object
      .keys( this.ui )
      .reduce( ( acc, key ) => ( 
        { ...acc, [key]: this.$route.query[key] } 
      ), {} )
    }
  }, 

  methods: {
    ...mapMutations( 'meta', [ 'SET_MOBILE' ] ),
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
      this.meta = await this.$store.dispatch( 'meta/get_meta' )
    } catch ( error ) {
      this.$router.push( 
        _throw( error ) 
      )
    }
  },

  sockets: {

    // When we connect to the socket server, we need to
    // send everyone our uuid, even if the viewer hasn't
    // been stored to the database, this way, all visitors
    // can see each other and send reactions.

    connect() {
      logger.info( 'SOCKET', 'Connected.' )
      this.$socket.client.emit('viewer', {
        uuid: this.uuid,
        connected: true,
      })
    },

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
      <Fallback 
        v-else 
        message="Loading..."
      />
    </transition>
  </router-view>

</template>


<style>

/* Base styles for the whole app */

@import '@/assets/base.css';

.fade-leave-active {
  opacity: 1;
  animation: leave var(--enter) ease 2s forwards;
}

@keyframes leave {
  from { opacity: 1; }
  to { opacity: 0; }
}

</style>
