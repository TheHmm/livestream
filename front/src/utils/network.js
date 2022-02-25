import jsonSize    from 'json-size'
import axios       from 'axios'
import { Service } from 'axios-middleware'

import config      from '../config'
import api         from '../api'
import store       from '../store'
import { logger }  from '.'


// Network utilities: These functions try to
// track the website's network activity

// This is an SPA, so a lot has hacked together 
// to make this work. It cannot be 100% accurate.
// For example, we cannot access the browser's 
// cache to see if assets have been loaded from 
// there. 

// The chosen approach is to over-calculate

const 

  api_url = config.apiURL,


  // Formating bytes to human readable format.

  format_bytes = ( bytes, decimals = 3 ) => {
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

  get_bytes_sent = request => {

    const 

      // Small difference calculated by subracting size of
      // request headers in browser network monitor from 
      // their size calculated by json size. 
      
      HEADER_GAP = 84,
      bytes_sent = jsonSize( request ) + HEADER_GAP

    return bytes_sent

  },


  // Gets the size in bytes of responses received.

  get_bytes_received = response => {

    const 

      // Small difference calculated by subracting size of 
      // response headers in browser network monitor from 
      // their size calculated by json size. 

      HEADER_GAP     = 54,
    
      data           = response.data,
      headers        = response.headers,

      data_size      = +headers[ 'content-length' ] || data.length,
      header_size    = jsonSize( headers ) - HEADER_GAP,
      bytes_received = data_size + header_size

    return bytes_received

  },


  // Reporting data sent to store.

  on_request = request => {
    const url = request.url
    store.dispatch( 'network/add_bytes_sent', { 
      url   : url,
      to    : url.includes(api_url) ? 'api' : 'assets',
      bytes : get_bytes_sent( request )
    } )
    return request
  },


  // Reporting data received to store.

  on_response = response => {
    const url = response.request.responseURL
    store.dispatch( 'network/add_bytes_received', { 
      url   : url,
      from  : url.includes(api_url) ? 'api' : 'assets',
      bytes : get_bytes_received( response )
    } )
    return response
  },


  // Here we inject two middleware functions into 
  // axios so that we can monitor our network activity
  // and report to the vuex store.

  service = ( new Service( axios ) ).register( {
    onRequest  : request  => on_request( request ),  
    onResponse : response => on_response( response )
  } ),


  // Ask API to HEAD asset. We use the returned headers
  // to calculate how many bytes our webpage downloads
  // in static assets.

  head_asset = async asset => {
    if ( store.getters['network/is_registered_asset']( asset ) ) {
      logger.warn( 'NETWORK', `HEAD-ing registered url ${ asset }` )
      // return
    }
    try {
      await api.assets.head( asset )
    } catch ( err ) {
      logger.error( 'NETWORK', err )
    }
  },


  // Problem: SPA doesn't know its own size.

  // This is resolved in a very hacky way: We get all
  // the <script> and <link> tags from the <head> and
  // make a HEAD request to get their sizes. 

  head_assets = async () => {

    head_asset( 'index.html' )

    const 
      scripts = document.querySelectorAll('script'),
      styles = document.querySelectorAll('link')

    for (const script of scripts) {
      if (script.src && !script.src.includes('@')) {
        head_asset( script.src )
      }
    }

    for (const style of styles) {
      if ( style.href ) {
        head_asset( style.href )
      }
    }
 
  },


  // We inject an observer to check for newly added
  // <script> and <style> tags ¯\_ (ツ)_/¯ 

  observer = ( new MutationObserver( mutations => {
    for ( const mutation of mutations ) {
      for ( const node of mutation.addedNodes ) {
        if ( node.href || node.src ) {
          head_asset( node.href || node.src )
        }
      }
    } 
  } ) )
  .observe( document.head, { childList: true } )


  // socket 


  // mux 

  

export default {
  format_bytes,
  head_assets,
}
