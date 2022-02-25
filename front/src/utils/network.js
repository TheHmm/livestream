import jsonSize    from 'json-size'
import axios       from 'axios'
import { Service } from 'axios-middleware'
import store       from '../store'
import config      from '../config'
import { logger }  from '.'

const 

  format_bytes = ( bytes, decimals = 3 ) => {
    if ( bytes === 0 ) {
      return '0 Bytes' 
    }
    const 
      k     = 1024,
      dm    = decimals < 0 ? 0 : decimals,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i     = Math.floor( Math.log( bytes ) / Math.log( k ) ),
      res   = parseFloat( ( bytes / Math.pow( k, i ) ).toFixed( dm ) ) + ' ' + sizes[ i ]
    return res
  },

  assets = {

    

  },

  api = {


    url: config.apiURL,


    // Gets the size in bytes of requests sent to strapi.

    get_bytes_sent( request ) {

      const 

        // Small difference calculated by subracting size of request 
        // headers in browser network monitor from their size calculated
        // by json size. 
        
        HEADER_GAP = 84,
        bytes_sent = jsonSize( request ) + HEADER_GAP
  
      return bytes_sent

    },


    // Gets the size in bytes of responses received from strapi.

    get_bytes_received( response ) {
  
      const 
  
        // Small difference calculated by subracting size of response 
        // headers in browser network monitor from their size calculated
        // by json size. 
  
        HEADER_GAP     = 54,
     
        data           = response.data,
        headers        = response.headers,
  
        data_size      = +headers[ 'content-length' ] || data.length,
        header_size    = jsonSize( headers ) - HEADER_GAP,
        bytes_received = data_size + header_size
  
      return bytes_received

    }
  },

  socket = {

  },

  mux = {

  },

  service = new Service( axios )



// Here we inject two middleware functions into 
// axios so that we can monitor our network activity
// and report to the vuex store.

service.register( {


  // Reporting data sent (in the form of axios requests)

  onRequest( request ) {
    const 
      url   = request.url,
      to    = url.includes(api.url) ? 'api' : 'assets',
      bytes = api.get_bytes_sent( request )
    store.dispatch( 
      'network/add_bytes_sent', 
      { url, to, bytes } 
    )
    return request
  },


  // Reporting data received (in the form of responses)
  
  onResponse( response ) {
    const
      url   = response.request.responseURL,
      from  = url.includes(api.url) ? 'api' : 'assets',
      bytes = api.get_bytes_received( response )
    store.dispatch( 
      'network/add_bytes_received',
      { url, from, bytes }  
    )
    return response
  }

} )


export default {
  format_bytes,
  assets,
  api,
  socket,
  mux
}
