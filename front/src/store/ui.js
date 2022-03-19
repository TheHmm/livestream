export default {

  namespaced: true,

  state: {

    mobile: false,
    
    options: {

      reduce_motion: { 
        label: "Reduce motion", 
        value: false,
        icons: {
          true  : 'volume',
          false : 'mute'
        }
      },

    },
  },

  mutations: {

    SET_MOBILE : ( state, mobile ) => {
      state.mobile = mobile
    },
    
    SET_OPTION : (state, { key, value }) => {
      state.options[key].value = value
    },

    SET_OPTIONS : (state, options) => {
      state.options = options
    },

  },

  actions: {

    set_option: ({ commit, dispatch }, { key, value }) => {
      commit('SET_OPTION', { key, value })
      dispatch('save_options_to_store')
    },
    
    load_options_from_store: ({ commit }) => {
      const found = localStorage.access_options && JSON.parse(localStorage.access_options)
      if ( found ) {
        commit('SET_OPTIONS', found)
      }
    },

    save_options_to_store: ({ state }) => {
      localStorage.access_options = JSON.stringify( state.options )
    },


  }

}
