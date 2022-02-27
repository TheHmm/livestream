import json_size from 'json-size'

export default {

  json_size,

  // Formating bytes to human readable format.

  format_bytes : ( bytes, decimals = 3 ) => {
    if ( bytes === 0 ) {
      return '0 Bytes' 
    }
    const 
      k   = 1024,
      dm  = decimals < 0 ? 0 : decimals,
      szs = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ],
      i   = Math.floor( Math.log(bytes) / Math.log(k) ),
      res = parseFloat( (bytes / Math.pow(k, i)).toFixed(dm) ) + ' ' + szs[i]
    return res
  },


  // Gets the size in bytes of requests sent.

  get_bytes_sent : request => {

    const 

      // Small difference calculated by subracting size of
      // request headers in browser network monitor from 
      // their size calculated by json size. 
      
      HEADER_GAP = 84,
      bytes_sent = json_size( request ) + HEADER_GAP

    return bytes_sent

  },


  // Gets the size in bytes of responses received.

  get_bytes_received : response => {

    const 

      // Small difference calculated by subracting size of 
      // response headers in browser network monitor from 
      // their size calculated by json size. 

      HEADER_GAP     = 54,
    
      data           = response.data,
      headers        = response.headers,

      data_size      = +headers[ 'content-length' ] || data.length,
      header_size    = json_size( headers ) - HEADER_GAP,
      bytes_received = data_size + header_size

    return bytes_received

  },

}
