
// Network store module: These fuctions are used
// to keep track of the network activity (such as 
// data transfer sizes) of this website.

export default {

  namespaced: true,

  state: {


    // The categories of the website that we can record
    // data transfer to and from, each has it's own logic.
    // refer to utils/networking for more details.

    transfers : {
      bytes_sent     : [],
      bytes_received : []
    }

  },

  mutations: {


    // We update the appropriate category of networking
    // payloads with bytes sent and received.

    ADD_BYTES_SENT : ( state, transfer ) => {
      state
      .transfers
      .bytes_sent
      .push( transfer )
    },

    ADD_BYTES_RECEIVED : ( state, transfer ) => {
      state
      .transfers
      .bytes_received
      .push( transfer ) 
    },


  },

  getters: {

    total_bytes_sent : state => state
      .transfers
      .bytes_sent
      .length
      && state
      .transfers
      .bytes_sent
      .map( t => t.bytes )
      .reduce( ( a, b ) => a + b )
    ,

    total_bytes_received : state => state
    .transfers
    .bytes_received
    .length
    && state
    .transfers
    .bytes_received
    .map( t => t.bytes )
    .reduce( ( a, b ) => a + b )
    ,

    total_bytes_transferred : ( state, getters ) => 
      getters.total_bytes_sent +
      getters.total_bytes_received
    ,

    last_bytes_sent : state => state
      .transfers
      .bytes_sent[
        state
        .transfers
        .bytes_sent
        .length - 1
      ]
    ,

    last_bytes_received : state => state
      .transfers
      .bytes_received[
        state
        .transfers
        .bytes_received
        .length - 1
      ]
    ,


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
