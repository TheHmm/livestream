<script>
import { mapGetters } from 'vuex'


// Submenu for stream modes

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
      set( mode ) {
        this.$router.push({
          query: {
            ...this.$route.query,
            ...{ mode: mode.name }
          }
        })
      }
    },

  },


  // When switching to video mode, HLS will load some more
  // available modes. Here the 'video' mode refers to hls'
  // 'auto' level.

  watch: {
    current_mode: {
      handler( new_mode, old_mode ) {
        if ( new_mode.video ) {
          this.set_video_mode_label( 'auto' )
        } else {
          this.set_video_mode_label( 'video' )
        }
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
  <ul
    role="menu"
    aria-label="Choose from several available livestream consumption modes"
  >
    <li
      v-for="mode in modes"
      role="menuitem"
      :key="mode.name"
      :style="{ '--url': `url(../../assets/icons/${mode.name}.svg)` }"
      class="mode"
    >
      <input
        type="radio"
        :id="mode.name"
        :name="mode.label"
        :value="mode"
        v-model="current_mode"
      />
      <label
        :for="mode.name"
        :title="`Switch to ${ mode.label } streaming mode`"
      >
        {{ mode.label }}
      </label>
    </li>
  </ul>
</template>
