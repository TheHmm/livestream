export default {

  header_gaps: {

    
    // Small difference calculated by subracting size of
    // request headers in browser network monitor from 
    // their size calculated by json size.

    requests  : 84,


    // Small difference calculated by subracting size of 
    // response headers in browser network monitor from 
    // their size calculated by json size. 

    responses : 54

  },

  socket: {
    

    // Number of bytes used in the initial socket 
    // handshake / transaction. This number seems to 
    // be consistent across browsers so it's safer to 
    // account for it than not.

    handshake_bytes: 1148,

  },

  mux: {


    // request bytes

    request_bytes: 291

  }

}
