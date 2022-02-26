import jsonSize    from 'json-size'
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

  tools = {


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
        bytes_sent = jsonSize( request ) + HEADER_GAP

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
        header_size    = jsonSize( headers ) - HEADER_GAP,
        bytes_received = data_size + header_size

      return bytes_received

    },

  },

  hooks = {


  // Reporting data sent to store.

    on_request : request => {
      const 
        url   = request.url,
        to    = url.includes(api_url) ? 'api' : 'assets',
        bytes = tools.get_bytes_sent( request )
      store.dispatch( 'network/add_bytes_sent', { url, to, bytes } )
      logger.info( 'NETWORK', `${ bytes } bytes sent to ${ to }.` )
      return request
    },


    // Reporting data received to store.

    on_response : response => {
      const 
        url = response.request.responseURL,
        from = url.includes(api_url) ? 'api' : 'assets',
        bytes = tools.get_bytes_received( response )
      store.dispatch( 'network/add_bytes_received', { url, from, bytes } )
      logger.info( 'NETWORK', `${ bytes } bytes received from ${ from }.` )
      return response
    },

  },


  methods = {


    // Ask API to HEAD asset. We use the returned headers
    // to calculate how many bytes our webpage downloads
    // in static assets.

    head_asset : async asset => {
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

    async head_assets() {

      this.head_asset( 'index.html' )

      const 
        scripts = document.querySelectorAll('script'),
        styles = document.querySelectorAll('link')

      for (const script of scripts) {
        if (script.src && !script.src.includes('@')) {
          this.head_asset( script.src )
        }
      }

      for (const style of styles) {
        if ( style.href ) {
          this.head_asset( style.href )
        }
      }
  
    },

  },


  watchers = {

    
    // Here, we inject two middleware functions into 
    // axios so that we can monitor our network activity
    // and report to the vuex store.

    api_monitor : {
      
      create( axios ) {
        return new Service( axios )
      },

      register( monitor ) {
        monitor.register( {
          onRequest  : request  => hooks.on_request( request ),  
          onResponse : response => hooks.on_response( response )
        } )
      },

      init( axios ) {
        const monitor = this.create( axios )
        this.register( monitor )
      }

    },



    //
    // 

    socket_monitor : {
      
      create( ) {
        return ( ( eventName, ...args ) => {
          console.log( eventName, args )
          // ...
        });
        
      },

      register( socket, monitor ) {
        socket.onAny( monitor )

      },

      init( socket ) {
        const monitor = this.create( socket )
        this.register( socket, monitor )
      }

    },

    
    // We inject a mutation observer to check for newly 
    // added <script> and <style> tags ¯\_ (ツ)_/¯ 

    asset_observer: {

      create() { 
        return new MutationObserver( mutations => {
          for ( const mutation of mutations ) {
            for ( const node of mutation.addedNodes ) {
              if ( node.href || node.src ) {
                methods.head_asset( node.href || node.src )
              }
            }
          } 
        } )
      },

      register( observer ) {
        observer.observe( document.head, { childList: true } )
      },

      init() {
        const observer = this.create()
        this.register( observer )
      }

    }

  },


  init = ( axios, socket, loglevel) => {


    watchers.api_monitor.init( axios )
    watchers.socket_monitor.init( socket )
    watchers.asset_observer.init()

    methods.head_assets()

    
  }

  // socket 


  // mux 

  

export default {
  tools,
  hooks,
  methods,
  watchers,
  init
}
