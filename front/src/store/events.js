import api        from "../api"
import { default_colors } from '@/utils/color'
import config from '@/config'
import $time      from '@/utils/time'
import router     from '@/router'

export default {

  namespaced: true,

  state: {
    events: {},
    preview_time: 0,
    fonts: {}
  },

  mutations: {
    SET_EVENT  : ( state, event )  => {
      state.events[ event.slug ] = event
    },
    SET_PREVIEW_TIME: ( state, time ) => {
      state.preview_time = time 
    },
    SET_FONT: ( state, font ) => {
      state.fonts[font.name] = font.file.url
    }
  },

  getters: {

    get_past_events : state => {
      return Object.values( state.events )
      .filter( e => new Date( e.ends ) < new Date() )  
      .sort( ( a , b ) => new Date( a.starts ) < new Date( b.starts ))
    },

    get_future_events : state => {
      return Object.values( state.events )
      .filter( e => new Date( e.starts ) > new Date() )  
      .sort( ( a , b ) => new Date( a.starts ) < new Date( b.starts ))
    },

    years : ( state, getters ) => {
      return [ ...new Set( getters.get_past_events.map( e => {
        return $time.get_year( e.starts )
      }))]
    },

    organisations: ( state, getters ) => {
      const organisations = []
      getters.get_past_events.map( e => {
        if ( e.organisation && !organisations.find( o => o.slug == e.organisation.slug ) ) {
          organisations.push( e.organisation )
        }
      })
      return organisations
    },

    get_event : state => slug => {
      return state.events[ slug ] || null
    },

    preview_event: state => {
      return Object.values( state.events ).find( e => e.is_preview_event )
    },

    preview_time: state => {
      return state.preview_time
    },

    font: state => font => {
      return state.fonts[font.name]
    },

    current_event : ( state, getters ) => {
      const slug = router.currentRoute._value.params.slug
      return getters.get_event( slug )
    },

    current_event_id : ( state, getters ) => {
      return getters.current_event?.documentId
    },

    current_event_default_mode : ( state, getters ) => {
      return getters.current_event?.default_player_mode
    },

    release_dots: ( state, getters ) => {
      return getters.current_event?.releaseDots
    },

    emoji_allowed : ( state, getters ) => {
     return getters.current_event?.allowEmoji
    },

    emoji_groups : ( state, getters ) => {
      return getters.current_event?.emoji_groups
    },

    get_emoji : ( state, getters ) => ( group, emoji ) => {
      if ( group == '__DEFAULT__' ) {
        return { name: emoji, group }
      } else {
        return getters
        .emoji_groups
        .find( g => g.slug == group )
        .emoji
        .find( e => e.name == emoji )
      }
    },

  },

  actions: {


    // Sanitize and commit set event. Called on every receipt
    // of an event object ( either from API or socket )

    set_event( { commit, getters, rootGetters, dispatch }, event ) {
      if ( event.slug ) {
        commit( 'SET_EVENT', sanitize( event, getters, commit ) )
      }
    },

  
    // for previewing events in arhcive page

    set_preview_event({ commit, getters }, slug ) {
      if ( slug ) {
        commit( 'SET_EVENT', sanitize( { slug, is_preview_event: true }, getters, commit ) )
      } else {
        getters.get_past_events.map( e => {
          if ( e.is_in_past ) {
            commit( 'SET_EVENT', sanitize( { slug: e.slug, is_preview_event: false }, getters, commit ) )
          }
        })
        commit( 'SET_PREVIEW_TIME', 0 )
      }
    },


    set_preview_time( { commit }, e ) {
      commit( 'SET_PREVIEW_TIME', e.pageX / window.innerWidth )
    },


    // Fetch number of events

    fetch_events_count({},  time ) {
      return new Promise( ( resolve, reject ) =>
        api
        .events
        .count( time )
        .then( count => resolve( count ) )
        .catch( error => reject( error ) )
      )
    },


    // Fetch all events

    fetch_past_events( { dispatch } ) {
      return new Promise( ( resolve, reject ) =>
        api
        .events
        .getPast()
        .then( events => {
          for ( const event of events ) {
            dispatch( 'set_event', event )
          }
          resolve( events )
        } )
        .catch( error => reject( error ) )
      )
    },

    
    // Fetch future events

    fetch_future_events( { dispatch } ) {
      return new Promise( ( resolve, reject ) =>
        api
        .events
        .getFuture()
        .then( events => {
          for ( const event of events ) {
            dispatch( 'set_event', event )
          }
          resolve( events )
        } )
        .catch( error => reject( error ) )
      )
    },


    // Fetch single event

    fetch_event( { dispatch }, { slug, password } ) {
      return new Promise( ( resolve, reject ) =>
        api
        .events
        .get({ slug, password })
        .then( event => {
          dispatch( 'set_event', event )
          resolve( event )
        } )
        .catch( error => reject( error ) )
      )
    },


    // Inform strapi of visit to log total number of them

    log_event_visit( { dispatch }, slug ) {
      return new Promise( ( resolve, reject ) =>
        api
        .events
        .log_visit(slug)
        .then( result => resolve( result ) )
        .catch( error => reject( error ) )
      )
    },


    // Get all events; always fetches event count from
    // Strapi to check if we have all of them. If not,
    // we fetch them.

    async get_past_events( { getters, dispatch } ) {
      const local_count = getters.get_past_events.length
      let remote_count
      try {
        remote_count = await dispatch( 'fetch_events_count', 'past' )
      } catch ( error ) {
        remote_count = local_count
      }
      if ( remote_count > local_count ) {
        return await dispatch( 'fetch_past_events' )
      } else {
        return getters.get_past_events
      }
    },


    // Get future events

    async get_future_events( { getters, dispatch } ) {
      const local_count = getters.get_future_events.length
      let remote_count
      try {
        remote_count = await dispatch( 'fetch_events_count', 'future' )
      } catch ( error ) {
        remote_count = local_count
      }
      if ( remote_count > local_count ) {
        return await dispatch( 'fetch_future_events' )
      } else {
        return getters.get_future_events
      }
    },


    // Get single event; we only call this function
    // when we are requesting the full event details
    // (e.g. for the event page), so we first check if
    // we have those details before calling fetch.

    // Our control property here is the 'viewers' field, a
    // relational field on the event strapi object that is
    // not populated in the fetch_events() api call.

    async get_event( { getters, dispatch }, { slug, password }) {
      const event = getters.get_event( slug )
      if ( event && event.viewers ) {
        return event
      } else {
        return await dispatch( 'fetch_event', { slug, password } )
      }
    },


    // Handle updates from strapi created in real
    // time during the event.

    socket_eventUpdate( { dispatch }, event ) {
      dispatch( 'set_event', event )
    }


  }


}



// Sanitizing 'events' type received from Strapi.

function sanitize ( event, getters, commit ) {


  // If the event exists in our store, than this
  // function was called to update it. We merge.

  const found = getters.get_event( event.slug )
  if ( found ) {
    event = { ...found, ...event }
  }

  console.log(event)


  // Define event styles

  event.styles = {
    '--back': event.background_color || default_colors['--back'],
    '--fore': event.text_color || default_colors['--fore'],
    '--accent': event.accent_color || default_colors['--accent'],
  }
  if ( event.background_image && event.background_image.formats?.medium ) {
    event.styles['--back-img'] = `url(${ config.api_img_url + event.background_image.formats.medium.url })`
  }
  if ( event.text_outline ) {
    event.styles['--text-outline'] = `-1px -1px 0 ${ event.styles['--accent'] }, 1px -1px 0 ${ event.styles['--accent'] }, -1px 1px 0 ${ event.styles['--accent'] }, 1px 1px 0 ${ event.styles['--accent'] }`
  }
  if ( event.font && event.font.file ) {
    if ( !getters.font( event.font ) ) {
      let font = new FontFace( event.font.name, `url(${ config.api_img_url + event.font.file.url })`)
      font.load().then(() => {
        document.fonts.add( font )
        commit( 'SET_FONT', event.font )
      })
    }
    event.styles['--font'] = event.font.name
  }

  if ( !event.recording ) {
    event.recording = event.mux_recording
  }

  // Way to tell if it has been more than 12 hours since the
  // event has ended.

  event.is_in_past = $time.is_in_past( event.ends )

  return event
}
