
import { createStore } from 'vuex'

export default createStore({

  // strict mode is only enabled for dev environment.

  strict: process.env.NODE_ENV !== 'production',

  state: {
  
    metainfo: null,
    isMobile: false,
    
    activeClasses: [ 'active' ],
  
    broadcasts: [],
    currentBroadcast: null,
    pastBroadcast: null,
    colorPalette: [ 'background', 'background2', 'body', 'highlight', 'controls', 'chat' ],
    
    talkstream: null,
    filmstream: null,
    
    users: {},
    chat: {},
    announcements: {},
    
    uid: localStorage.uid 
      ? localStorage.uid
      : null,
    blocked: false,
    count: 0,

    geoblocked: false,
    isAdmin: localStorage.administrator 
      ? JSON.parse(localStorage.administrator) 
      : false,

    forceSmog: false,
    
  },


  mutations: {
  
    setMetaInfo:      (state, metainfo) => state.metainfo = metainfo,

    setBroadcasts:    (state, broadcasts) => state.broadcasts = broadcasts,
    selectBroadcast:  (state, broadcast) => state.currentBroadcast = broadcast,
    setPastBroadcast: (state, pastBroadcast) => state.pastBroadcast = pastBroadcast,
    
    setTalkstream:    (state, talkstream) => state.talkstream = talkstream,
    setFilmstream:    (state, filmstream) => state.filmstream = filmstream,
    
    setUsers:         (state, users) => state.users = users,
    setUser:          (state, user) => state.users[user.uid] = user,
    
    setChat:          (state, chat) => state.chat = chat,
    setMessage:       (state, message) => state.chat[message.time] = message,

    setAnnouncements: (state, announcements) => state.announcements = announcements,
    setAnnouncement:  (state, announcement) => state.announcements[announcement.time] = announcement,
  
    setUid:           (state, uid) => state.uid = uid,
    setBlock:         (state, block) => state.blocked = block,
    setCount:         (state, count) => state.count = count,

    geoblock:         state => state.geoblocked = true,
    setMobile:        (state, isMobile) => state.isMobile = isMobile,
    adminify:         state => state.isAdmin = true,
    
    setSmog:          (state, smog) => state.forceSmog = smog,
    set3D:            (state, effect3D) => state.force3D = effect3D,
    toggleSmog:       state => state.forceSmog = !state.forceSmog,
    toggle3D:         state => state.force3D = !state.force3D,

  },


  actions: {
  
    registerBroadcasts({ state, commit }, broadcasts ) {
      commit(
        'setBroadcasts', broadcasts
        .map(b => ({ 
          ...b,
          theme      : state.colorPalette.map(s => ({ [`--${s}`]: b[s] }) ),
          isInPast   : new Date() > new Date(b.FilmEndsOn),
          isInFuture : new Date() < new Date(b.LiveStartsOn)
        }))
      )
    }, 
    
  
    socket_streamUpdate({ state, commit }, data) {
      const receievedID = data.playbackId
      if (receievedID == state.filmstream.playbackId) {
        console.log('FILM:', data.status)
        commit('setFilmstream', data)
      } else if (receievedID == state.talkstream.playbackId) {
        console.log('TALK:', data.status)
        commit('setTalkstream', data)
      }
    },
    
    socket_user({ state, commit }, user) {
      commit('setUser', user)
      if (
        state.uid &&
        user.uid === state.uid &&
        !state.isAdmin
        // user.uid.includes(state.uid.replace(user.name, '')) &&
      ) {
        if (user.blocked) {
          console.log('blocked')
          commit('setBlock', true)
        } else {
          console.log('unblocked')
          commit('setBlock', false)
        }
      } 
    },
    
    socket_userConfirm({ commit }, uid) {
      console.log('Your User ID:', uid)
      commit('setUid', uid)
      localStorage.uid = uid
    },

    socket_count({ commit }, count) {
      commit('setCount', count)
    },
    
    socket_clearchat({ commit }) {
      commit('setChat', {})
    },
    
    socket_clearusers({ commit }) {
      commit('setUsers', {})
      localStorage.clear()
      window.location.reload(true)
    },

    socket_smog({ commit }, smog ) {
      commit('setSmog', smog)
    },

    socket_effect3D({ commit }, effect3D ) {
      commit('set3D', effect3D)
    },
    
    register({ state }, name) {
      console.log(state.users)
      this._vm.$socket.client.emit('user', {
        name: name,
        blocked: false,
      })
    },

    deleteMessage(state, message) {
      this._vm.$socket.client.emit('message', {
        ...message, 
        ...{ 
          deleted: true 
        }
      })
    },
    
    adminify({ commit }, pw) {
      if (pw === 'yellow') {
        commit('adminify')
        localStorage.administrator = true
      }
    },
    
    toggle3D({ state }) {
      this._vm.$socket.client.emit('effect3D', !state.force3D)
    },

    toggleSmog({ state }) {
      this._vm.$socket.client.emit('smog', !state.forceSmog)
    },

  },


  getters: {
  
    ready: state => (
      state.filmstream &&
      state.talkstream 
    ),
    
    isActive: state => status => [
      ...state.activeClasses,
      state.metainfo.buttonWhenStreamIsActive,
      state.metainfo.buttonWhenStreamIsRewatchable,
    ].includes(status),
    
    chatArray: state => (
      Object.values(state.chat)
    ),
    
    chatByTime: (state, getters) => {
      let chatByTime = []
      if (!state.isMobile) {
        chatByTime = [...getters.chatArray]
        .filter(m => !m.deleted)
        .filter(m => m.time > 0)
        .sort((a, b) => a.time - b.time)
      } else {
        chatByTime = [...getters.chatArray, ...getters.publishedAnns]
        .filter(m => !m.deleted)
        .filter(m => m.time > 0)
        .sort((a, b) => {
          const 
            aTime = a.publishedAt || a.time,
            bTime = b.publishedAt || b.time
          return aTime - bTime
        })
      }
      return chatByTime
    },

    publishedAnns: ( state, getters ) => ( getters
      .announcementsArray
      .filter(m => m.time > 0)
      .filter(m => m.publishedAt > 0)
      .sort((a, b) => a.publishedAt - b.publishedAt)
    ),

    unpublishedAnns: ( state, getters ) => ( getters
      .announcementsArray
      .filter(m => m.time > 0)
      .filter(m => m.publishedAt == 0)
      .sort((a, b) => a.time - b.time)
    ),

    announcementsArray: state => ( Object
      .values(state.announcements)
      .filter(m => m.deleted === false)
    ),

  },


})
