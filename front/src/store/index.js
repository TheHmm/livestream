import { createStore } from 'vuex'
import api from '../api'
import livestream from './livestream'
import events from './events'
import networking from './networking'
import { logger } from '../utils'


const DEFAULT_STATE = () => ({


  meta          : null,

  isMobile      : false,

  colorPalette  : [
    'background', 
    'background2', 
    'body', 
    'highlight',
    'controls', 
    'chat' 
  ],

  activeClasses : [ 'active' ],
  
  users         : {},
  chat          : {},
  announcements : {},
  
  uid           : localStorage.uid ? localStorage.uid : null,
  blocked       : false,
  count         : 0,

  isAdmin       : localStorage.admin ? JSON.parse(localStorage.admin) : false,

})


export default createStore({


  // strict mode is only enabled for dev environment.

  strict: process.env.NODE_ENV !== 'production',

  state: DEFAULT_STATE(),

  modules: {
    livestream,
    events,
    networking
  },

  mutations: {


    SET_META       : ( state, meta )   => state.meta = meta,
    SET_MOBILE     : ( state, mobile ) => state.isMobile = mobile,
    
    setUsers:         (state, users) => state.users = users,
    setUser:          (state, user) => state.users[user.uid] = user,
    
    setChat:          (state, chat) => state.chat = chat,
    setMessage:       (state, message) => state.chat[message.time] = message,

    setAnnouncements: (state, announcements) => state.announcements = announcements,
    setAnnouncement:  (state, announcement) => state.announcements[announcement.time] = announcement,
  
    setUid:           (state, uid) => state.uid = uid,
    setBlock:         (state, block) => state.blocked = block,
    setCount:         (state, count) => state.count = count,

    setMobile:        (state, isMobile) => state.isMobile = isMobile,
    adminify:         state => state.isAdmin = true,
    
    RESET: state => {
      const newState = DEFAULT_STATE()
      Object
      .keys( newState )
      .forEach( key => state[ key ] = newState[ key ] )
    },

  },


  getters: {
  
    
    meta: state => state.meta,
    

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

  actions: {


    // App meta-data such as titles and meta descriptions

    fetch_meta({ commit }) { return new Promise( ( resolve, reject ) => 
      api
      .meta
      .get()
      .then( meta => {
        commit( 'SET_META', meta )
        resolve( meta ) 
      } )
      .catch( error => reject( error ) )
    ) },

    async get_meta({ getters, dispatch }) {
      return getters.meta || await dispatch( 'fetch_meta' )
    },


    // reset store 

    reset({ commit }) {
      commit('RESET')
    },
  
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



    socket_connect({strapi}) {
      logger.info('STORE', 'connect')
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
          logger.warn(`STORE`, 'blocked')
          commit('setBlock', true)
        } else {
          logger.warn(`STORE`, 'unblocked')
          commit('setBlock', false)
        }
      } 
    },
    
    socket_userConfirm({ commit }, uid) {
      logger.info('STORE', 'Your User ID:', uid)
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

    register({ state }, name) {
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
    

  },


  


})
