import api from "../api"
import color from '@/utils/color'
import $time from '@/utils/time'
import livestream from '@/utils/livestream'
import captions from '@/utils/captions'
import router from '@/router'

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

    get_events : state =>
      Object
      .values( state.events )
      .sort( ( a , b ) => {
        return new Date( a.starts ) > new Date( b.starts )
      })
    ,

    years : ( state, getters ) =>
      [ ...new Set(
      getters
      .get_events
      .map( e => $time.get_year( e.starts ) )
      )]
    ,

    get_event : state => slug =>
      state
      .events[ slug ]
    ,

    event_bv_id : ( state, getters ) => id =>
      getters
      .get_events
      .find( e => e.id == id )
    ,

    current_event : ( state, getters ) =>
      getters
      .get_event(
        router
        .currentRoute
        ._value
        .params
        .slug
      )
    ,

    current_event_id : ( state, getters ) =>
      getters
      .current_event
      .id
    ,

    emoji_allowed : ( state, getters ) =>
      getters
      .current_event
      ?.allowEmoji
    ,

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

    get_event_slugs : state =>
      Object
      .keys( state.events )
    ,

    highlight_donate: ( state, getters ) =>
      getters.current_event?.highlightDonateButton

  },

  actions: {


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

    async get_event( { getters, dispatch }, slug ) {
      const event = getters.get_event(slug)
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
// Note that for each of these events, we add a
// 'livestream' property that returns a different
// object based on when the event is happening.

function sanitize ( event, rootGetters, dispatch ) {

  if ( event.accent ) {
    event.accent = color.hsl_to_css_vars(event.accent)
  }

  if ( event.emoji_groups?.data ) {
    event.emoji_groups.data.map( g => {
      g.emoji.map( e => e.image = e.image?.data )
    })
    event.emoji_groups = event.emoji_groups.data
  } else {
    delete event.emoji_groups
  }

  // Highlighting the donate tab

  if ( event.highlightDonateButton === true ) {
    setTimeout(() => {
      dispatch( 'set_event', {
        slug: event.slug,
        highlightDonateButton: false,
      })
    }, 5 * 1000)
  }

  // We search for the event livestream. In Strapi, all events
  // that have happened in the past have a MUX asset as their
  // livestream. And any events that are going to happen in
  // the future will not have a defined livestream field; and
  // should point to the ongoing strapi livestream.

  const asset = Object.assign( {}, event.livestream )

  if ( asset ) {
    event.livestream = () => asset
    if ( asset.status == 'ready' ) {
      event.cover = livestream.mux.thumb_src( asset.playbackId, 10 )
      get_and_set_cc( asset, dispatch )
    }
  } else {
    event.livestream = () => rootGetters[ 'livestream/get_livestream' ]
  }

  return event
}


function get_and_set_cc( asset, dispatch ) {
  const text_track = asset.tracks.find( t => {
    return t.type == 'text' && t.text_source == 'generated_live_final'
  })
  if ( text_track ) {
    const cc_url = livestream.mux.text_src( asset.playbackId, text_track.id )
    api.get( cc_url )
    .then( ({ data }) => dispatch(
      'livestream/set_CC',
      captions.parse_vtt( data ),
      { root: true }
    ))
    .catch( err => console.error( err ) )
  }
}
