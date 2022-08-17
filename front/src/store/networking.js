
// Network store module: These fuctions are used
// to keep track of the network activity (such as
// data transfer sizes) of this website.

export default {
  namespaced: true,


  // The categories of the website that we can record
  // data transfer to and from, each has it's own logic.
  // refer to utils/networking for more details.

  state: {
    bytes_sent     : [],
    bytes_received : []
  },


  // We update the appropriate category of networking
  // payloads with bytes sent and received.

  mutations: {
    ADD_BYTES_SENT : ( state, transfer ) => {
      state.bytes_sent.push( transfer )
    },
    ADD_BYTES_RECEIVED : ( state, transfer ) => {
      state.bytes_received.push( transfer )
    },
  },

  getters: {

    total_bytes_sent : state => {
      return (
        state.bytes_sent.length
       &&
        state.bytes_sent
        .map( t => t.bytes )
        .reduce( ( a, b ) => a + b )
      )
    },

    total_bytes_received : state => {
      return (
        state.bytes_received.length
       &&
        state.bytes_received
        .map( t => t.bytes )
        .reduce( ( a, b ) => a + b )
      )
    },

    total_bytes_transferred : ( state, getters ) => {
      return getters.total_bytes_sent + getters.total_bytes_received
    },

    last_bytes_sent : state => {
      return state.bytes_sent[ state.bytes_sent.length - 1 ]
    },

    last_bytes_received : state => {
      return state.bytes_received[ state.bytes_received.length - 1 ]
    },

  },

  actions: {
    add_bytes_sent( { commit }, { url, to, bytes } ) {
      commit( 'ADD_BYTES_SENT', { url, to, bytes } )
    },
    add_bytes_received( { commit }, { url, from, bytes } ) {
      commit( 'ADD_BYTES_RECEIVED', { url, from, bytes } )
    }
  }


}
