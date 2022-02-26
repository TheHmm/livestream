
// Network store module: These fuctions are used
// to keep track of the network activity (such as 
// data transfer size) of this website.

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
        registered: []
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
      state
      .transfers[ to ]
      .bytes_sent += bytes
    },

    ADD_BYTES_RECEIVED : ( state, { from, bytes } ) => {
      state
      .transfers[ from ]
      .bytes_received += bytes
    },


    // We store the URLs of our assets in an array so
    // that we know not to HEAD them again.

    REGISTER_ASSET : ( state, url ) => {
      state
      .transfers
      .assets
      .registered
      .push( url )
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

    is_registered_asset : state => path =>
      state
      .transfers
      .assets
      .registered
      .find( url => url.includes( path ) )
    ,
      

  },

  actions: {

    add_bytes_sent( { commit }, { url, to, bytes } ) {
      commit( 'ADD_BYTES_SENT', { to, bytes } )
      if ( to == 'assets' ) {
        commit( 'REGISTER_ASSET', url )
      }
    },

    add_bytes_received( { commit }, { url, from, bytes } ) {
      commit( 'ADD_BYTES_RECEIVED', { from, bytes } )
      if ( from == 'assets' ) {
        commit( 'REGISTER_ASSET', url )
      }
    }

  }


}
