import { logger } from "../utils"


// Network store module: These fuctions are used
// to keep track of the network activity (such as 
// data transfer size) of this website.

// This is an SPA, so a lot has hacked together 
// to make this work. Yet it cannot be 100% accurate.

export default {

  namespaced: true,

  state: {


    // The categories of the website that we can record
    // data transfer to and from, each has it's own logic.
    // refer to utils/networking for more details.

    transfers: {
      
      assets: {
        bytes_sent: 0,
        bytes_received: 0,
      },
  
      api: {
        bytes_sent: 0,
        bytes_received: 0,
      },
  
      socket: {
        bytes_sent: 0,
        bytes_received: 0,
      },
  
      mux: {
        bytes_sent: 0,
        bytes_received: 0,
      },

    }

  },

  mutations: {


    // We update the appropriate category of networking
    // payloads with bytes sent and received.

    ADD_BYTES_SENT : ( state, { to, bytes } ) => {
      state.transfers[ to ].bytes_sent += bytes
    },

    ADD_BYTES_RECEIVED : ( state, { from, bytes } ) => {
      state.transfers[ from ].bytes_received += bytes
    }

  },

  getters: {

    total_bytes_sent : state => Object
      .values( state.transfers )
      .map( t => t.bytes_sent )
      .reduce( ( a, b ) => a + b )
    ,

    total_bytes_received : state => Object
      .values( state.transfers )
      .map( t => t.bytes_received )
      .reduce( ( a, b ) => a + b )
    ,

    total_bytes_transferred : ( state, getters ) => 
      getters.total_bytes_sent +
      getters.total_bytes_received
    ,

  },

  actions: {

    add_bytes_sent( { commit }, { to, bytes } ) {
      commit( 'ADD_BYTES_SENT', { to, bytes } )
      logger.info( 'STORE', `Sent ${ bytes } bytes to ${ to }.` )
    },

    add_bytes_received( { commit }, { from, bytes } ) {
      commit( 'ADD_BYTES_RECEIVED', { from, bytes } )
      logger.info( 'STORE', `Received ${ bytes } bytes from ${ from }.` )
    }

  }


}
