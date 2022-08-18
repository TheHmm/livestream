import api        from "../api"
import color      from '@/utils/color'
import $time      from '@/utils/time'
import livestream from '@/utils/livestream'
import captions   from '@/utils/captions'
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
        return new Date( a.starts ) > new Date( b.starts )
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

    event_bv_id : ( state, getters ) => id => {
      return getters.get_events.find( e => e.id == id )
    },

    current_event : ( state, getters ) => {
      const id = router.currentRoute._value.params.slug
      return getters.get_event( id )
    },

    current_event_id : ( state, getters ) => {
      return getters.current_event?.id
    },

    highlight_donate: ( state, getters ) => {
      return getters.current_event?.highlightDonateButton
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

    set_event( { commit, rootGetters, dispatch }, event ) {
      commit( 'SET_EVENT', sanitize( event, rootGetters, dispatch ) )
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

function sanitize ( event, rootGetters, dispatch ) {


  // Convert the HSL accent string to someething digestible

  if ( event.accent ) {
    event.accent = color.hsl_to_css_vars(event.accent)
  }


  // Clean up dirty strapi component structure in response

  if ( event.emoji_groups?.data ) {
    event.emoji_groups.data.map( g => {
      g.emoji.map( e => e.image = e.image?.data )
    })
    event.emoji_groups = event.emoji_groups.data
  } else {
    delete event.emoji_groups
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


  // Way to tell if it has been more than 12 hours since the
  // event has passed.

  event.is_in_past = $time.is_in_past( event.ends )

  if ( event.is_in_past ) {
    event.livestream = () => undefined


    // We search for the event livestream. In Strapi, all events
    // that have happened in the past have a MUX asset as their
    // livestream. And any events that are going to happen in
    // the future will not have a defined livestream field; and
    // should point to the ongoing strapi livestream.

    if ( event.recording ) {
      if ( event.recording.status == 'ready' ) {
        event.cover = livestream.mux.thumb_src( event.recording.playbackId, 10 )
        get_and_set_cc( recording, dispatch )
      }
    }

  } else {
    event.livestream = () => rootGetters[ 'livestream/get_livestream' ]
  }

  return event
}


// Manually pulling the subtitle file of an asset if it even
// exists and converting it to text for the transcript mode

function get_and_set_cc( recording, dispatch ) {
  const text_track = recording.tracks.find( t => {
    return t.type == 'text' && t.text_source == 'generated_live_final'
  })
  if ( text_track ) {
    const cc_url = livestream.mux.text_src( recording.playbackId, text_track.id )
    api
    .get( cc_url )
    .then( ({ data }) => dispatch(
      'livestream/set_CC',
      captions.parse_vtt( data ),
      { root: true }
    ))
    .catch( err => console.error( err ) )
  }
}
