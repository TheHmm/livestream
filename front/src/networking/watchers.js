import { Service } from 'axios-middleware'
import config      from "@/config"
import store       from '@/store'
import { logger }  from '@/utils' 
import tools       from "./tools"
import methods     from './methods'

const api_url = config.api_url



export default { 

  
  // Here, we inject two middleware functions into 
  // axios so that we can monitor our network activity
  // and report to the vuex store.

  strapi_monitor : {

    hooks : {

      on_request : request => {
        const 
          url   = request.url,
          to    = url.includes(api_url) ? 'api' : 'assets',
          bytes = tools.get_bytes_sent( request )
        store.dispatch( 'networking/add_bytes_sent', { url, to, bytes } )
        logger.info( 'NETWORK', `${ bytes } bytes sent to ${ to }.` )
        return request
      },
  
      on_response : response => {
        const 
          url   = response.request.responseURL,
          from  = url.includes(api_url) ? 'api' : 'assets',
          bytes = tools.get_bytes_received( response )
        store.dispatch( 'networking/add_bytes_received', { url, from, bytes } )
        logger.info( 'NETWORK', `${ bytes } bytes received from ${ from }.` )
        return response
      },
  
    },
    
    create( axios ) {
      return new Service( axios )
    },

    register( monitor, hooks ) {
      monitor.register( {
        onRequest  : hooks.on_request,  
        onResponse : hooks.on_response
      } )
    },

    init( axios ) {
      const 
        monitor = this.create( axios ),
        hooks   = this.hooks
      this.register( monitor, hooks )
    }

  },



  // We inject two middleware functions into our socket
  // client so that we can monitor our network activity
  // and report to the vuex store.

  socket_monitor : {

    hooks: {

      on_send: ( event, data, bytes ) => {
        bytes = bytes || tools.json_size( data )
        store.dispatch( 'networking/add_bytes_sent', { 
          url : event, 
          to  : 'sockets', 
          bytes 
        } )
        logger.info( 'NETWORK', `${ bytes } bytes sent to sockets.` )
      },

      on_receive: ( event, data, bytes ) => {
        bytes = bytes || tools.json_size( data )
        store.dispatch( 'networking/add_bytes_received', { 
          url  : event, 
          from : 'sockets', 
          bytes 
        } )
        logger.info( 'NETWORK', `${ bytes } bytes received from sockets.` )
      },
      
    },
    
    create( ) {
      return this.hooks   
    },

    register( io, monitor ) {
      const old_emit = io.emit.bind(io)
      io.emit = ( ev, data ) => {
        monitor.on_send( ev, data )
        old_emit( ev, data )
      }
      io.onAny( monitor.on_receive )
    },

    init( io ) {

      const HANDSHAKE_BYTES = config.networking.socket.handshake_bytes
      this.hooks.on_receive( 'handshake', null, HANDSHAKE_BYTES )  

      const monitor = this.create( io )
      this.register( io, monitor )

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
  
}
