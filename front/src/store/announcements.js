import api from '../api'

export default {

  namespaced: true,

  state: {
    announcements: {}
  },

  mutations: {
    SET_ANNOUNCEMENT : ( state, announcement ) => {
      state.announcements[announcement.id] = announcement
    },
    DELETE_ANNOUNCEMENT : ( state, announcement ) => {
      delete state.announcements[announcement.id]
    },
  },

  getters: {
    announcements_array : state => {
      return Object.values( state.announcements )
    },
    announcements_by_time : ( state, getters ) => { 
      return (
        getters
        .announcements_array
        .sort( (a, b) => a.publishedAt - b.publishedAt )
      )
    },
  },

  actions: {
  }

}
