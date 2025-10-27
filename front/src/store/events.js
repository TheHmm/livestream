import api        from "../api"
import color      from '@/utils/color'
import $time      from '@/utils/time'
import livestream from '@/utils/livestream'
import router     from '@/router'

export default {

  namespaced: true,

  state: {
    events: {}
  },

  mutations: {
    SET_EVENT  : ( state, event )  => {
      state.events[ event.slug ] = event
    },
  },

  getters: {

    get_events : state => {
      return Object.values( state.events ).sort( ( a , b ) => {
        return new Date( a.starts ) < new Date( b.starts )
      })
    },

    years : ( state, getters ) => {
      return [ ...new Set( getters.get_events.map( e => {
        return $time.get_year( e.starts )
      }))]
    },

    get_event : state => slug => {
      return state.events[ slug ]
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

    highlight_donate: ( state, getters ) => {
      return getters.current_event?.highlightDonateButton
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
      commit( 'SET_EVENT', sanitize( event, getters, rootGetters, dispatch ) )
    },


    // Fetch number of events

    fetch_events_count( ) {
      return new Promise( ( resolve, reject ) =>
        api
        .events
        .count()
        .then( count => resolve( count ) )
        .catch( error => reject( error ) )
      )
    },


    // Fetch all events

    fetch_events( { dispatch } ) {
      return new Promise( ( resolve, reject ) =>
        api
        .events
        .getAll()
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

    fetch_event( { dispatch }, slug ) {
      return new Promise( ( resolve, reject ) =>
        api
        .events
        .get(slug)
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

    async get_events( { getters, dispatch } ) {
      const local_count = getters.get_events.length
      let remote_count
      try {
        remote_count = await dispatch( 'fetch_events_count' )
      } catch ( error ) {
        remote_count = local_count
      }
      if ( remote_count > local_count ) {
        return await dispatch( 'fetch_events' )
      } else {
        return getters.get_events
      }
    },


    // Get single event; we only call this function
    // when we are requesting the full event details
    // (e.g. for the event page), so we first check if
    // we have those details before calling fetch.

    // Our control property here is the 'viewers' field, a
    // relational field on the event strapi object that is
    // not populated in the fetch_events() api call.

    async get_event( { getters, dispatch }, slug ) {
      const event = getters.get_event( slug )
      if ( event && event.viewers ) {
        return event
      } else {
        return await dispatch( 'fetch_event', slug )
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

function sanitize ( event, getters, rootGetters, dispatch ) {

  // If the event exists in our store, than this
  // function was called to update it. We merge.

  const found = getters.get_event( event.slug )
  if ( found ) {
    event = { ...found, ...event }
  }


  // Convert the HSL accent string to someething digestible

  if ( event.accent && typeof event.accent == "string" ) {
    event.accent = color.hsl_to_css_vars(event.accent)
  }


  // Un/Highlighting the donate tab. This is done already in
  // Strapi, but just doing it again artificially in the front
  // end ensures no annoying jumping donate button.

  if ( event.highlightDonateButton === true ) {
    setTimeout(() => {
      dispatch( 'set_event', {
        slug : event.slug,
        highlightDonateButton : false,
      })
    }, 5 * 1000)
  }

  if ( !event.recording ) {
    event.recording = event.mux_recording
  }

  // Way to tell if it has been more than 12 hours since the
  // event has ended.

  event.is_in_past = $time.is_in_past( event.ends )
  if ( event.is_in_past ) {
    event.livestream = () => undefined
  } else {
    event.livestream = () => rootGetters[ 'livestream/get_livestream' ]
  }

  return event
}
