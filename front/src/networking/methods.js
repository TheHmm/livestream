import api        from '@/api'
import store      from "@/store"
import { logger } from "@/utils"

export default  {


  // Ask API to HEAD asset. We use the returned headers
  // to calculate how many bytes our webpage downloads
  // in static assets.

  head_asset : async asset => {
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

  connection: {

    get: ( ) => {
      console.log(navigator.connection || navigator.mozConnection || navigator.webkitConnection)
      return (
        navigator.connection || 
        navigator.mozConnection || 
        navigator.webkitConnection
      )
    }


  },

  report: {

    bytes_sent: ( { url, to, bytes } ) => {
      store.dispatch( 'networking/add_bytes_sent', { url, to, bytes } )
      logger.info( 'NETWORK', `${ bytes } bytes sent to ${ to }.` )
    },
    bytes_received: ( { url, from, bytes } ) => {
      store.dispatch( 'networking/add_bytes_received', { url, from, bytes } )
      logger.info( 'NETWORK', `${ bytes } bytes received from ${ from }.` )
    }

  }

}
