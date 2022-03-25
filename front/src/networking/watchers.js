import { Service } from 'axios-middleware'
import config      from "@/config"
import tools       from "./tools"
import methods     from './methods'

export default { 

  
  // Here, we inject two middleware functions into 
  // axios so that we can monitor our network activity
  // and report to the vuex store.

  strapi_monitor : {

    hooks : {

      on_request : request => {
        methods.report.bytes_sent({
          url   : request.url,
          to    : tools.which_server_is_it( request.url),
          bytes : tools.get_bytes_sent( request )
        })
        return request
      },
  
      on_response : response => {
        methods.report.bytes_received({
          url   : response.request.responseURL,
          from  : tools.which_server_is_it( response.request.responseURL ),
          bytes : tools.get_bytes_received( response )
        })
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



  // We inject middleware functions into our socket
  // client so that we can monitor our network activity
  // and report to the vuex store.

  socket_monitor : {

    hooks: {

      on_send: ( event, data, bytes ) => {
        methods.report.bytes_sent({
          url   : event,
          to    : 'sockets',
          bytes : bytes || tools.json_size( data )
        })
      },

      on_receive: ( event, data, bytes ) => {
        methods.report.bytes_received({
          url   : event, 
          from  : 'sockets', 
          bytes : bytes || tools.json_size( data )
        })
      },

      on_connect: () => { 
        methods.report.bytes_received({
          url   : 'handshake', 
          from  : 'sockets', 
          bytes : config.networking.socket.handshake_bytes
        })
      },

    },
    
    create( ) {
      return this.hooks   
    },

    register( io, monitor ) {
      io.on( 'connect', monitor.on_connect )
      io.onAny( monitor.on_receive )
      const old_emit = io.emit.bind(io)
      io.emit = ( ev, data ) => {
        monitor.on_send( ev, data )
        old_emit(ev, data)
      }
    },

    init( io ) {
      const monitor = this.create( io )
      this.register( io, monitor )
    }

  },


  // We inject middleware functions into HLS ( livestream
  // cosumer ) so that we can monitor its network activity
  // and report to the vuex store.

  stream_monitor : {


    hooks: {

      frag_loading: ( event, data ) => {
        methods.report.bytes_sent({
          url   : data.frag.baseurl,
          to    : 'mux',
          bytes : config.networking.mux.request_bytes + data.frag.baseurl.length
        })
      },
      frag_loaded: ( event, data ) => {
        methods.report.bytes_received({
          url   : data.frag.baseurl,
          from  : 'mux',
          bytes : data.frag.stats.loaded
        })
      }

    },
    
    create( ) {
      return this.hooks
    },

    register( hls, Events, monitor ) {
      console.log(hls, Events)
      hls.on( Events.FRAG_LOADING, monitor.frag_loading )
      hls.on( Events.FRAG_LOADED, monitor.frag_loaded )
    },

    init( hls, Events ) {
      const monitor = this.create()
      this.register( hls, Events, monitor )
    }


  },

  
  // We inject a network observer to monitor resources 
  // such as scripts, css files, img sources, etc...
  // This doesn't work in Safari. ¯\_ (ツ)_/¯ 

  assets_monitor: {

    create() { 
      return new PerformanceObserver( entries => {
        for ( const entry of entries.getEntriesByType("resource") ) {
          if ( entry.transferSize ) {
            setTimeout( () => {
              methods.report.bytes_received({
                url   : entry.name,
                from  : 'assets',
                bytes : entry.transferSize 
                    //  >= entry.encodedBodySize 
                    //  && entry.transferSize 
                    //  || entry.encodedBodySize
              })
            }, entry.duration )
          // } else if ( !entry.name.includes('https://api.live.thehmm.karls.computer/') ) {
            // console.log(entry.transferSize, entry.encodedBodySize, entry.name)
          }
        }
      } )
    },

    register( observer ) {
      observer.observe({ 
        type     : "resource",
        buffered : true
      })      
    },

    init() {
      const observer = this.create()
      this.register( observer )
    },


  }
  
}
