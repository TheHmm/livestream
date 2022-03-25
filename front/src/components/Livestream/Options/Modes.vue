<script>
import { mapGetters } from 'vuex'

export default {

  name: 'Modes',
  
  computed: {


    // We get the list of available streaming modes from the store
    // this list can be updated by HLS.js at any moment.

    ...mapGetters( 'livestream', [ 
      'modes',
    ]),


    // Don't know how far this will go before breaking.

    current_mode: {
      get() {
        return this.$store.getters['livestream/current_mode']( this )
      },
      set(mode) {
        this.$router.push({
          query: {
            ...this.$route.query,
            ...{ mode: mode.name }
          }
        })
      }
    },

  },

  watch: {
    current_mode: {
      handler( new_mode, old_mode ) {
        if ( new_mode.video ) {
          this.set_video_mode_label( 'auto' )
        } else {
          this.set_video_mode_label( 'high-res' )
        }
        // if ( old_mode.video && !new_mode.video ) {
        //   this.set_video_mode_label( 'high-res' )
        // }
        // else if ( !old_mode.video && new_mode.video ) { 
        //   this.set_video_mode_label( 'auto' )
        // }
      }
    }
  },

  methods: {
    set_video_mode_label( label ) {
      this.$store.commit('livestream/SET_MODE_LABEL', {
        name: 'video',
        label
      })
    }
  }

}
</script>

<template>
  <ul role="menu">
    <li 
      v-for="mode in modes"
      :key="mode.name"
      tabindex="0"
      class="mode"
      role="menuitem"
    >
      <label 
        :title="`Switch to ${ mode.label } streaming mode`"  
        tabindex="0"
      >
        <input 
          type="radio"
          :name="mode.label"
          :value="mode" 
          v-model="current_mode"
        />
        {{ mode.label }}
      </label>
    </li>
  </ul>
</template>

<style scoped>
.mode {
  padding: 0.2rem ;
}
</style>
