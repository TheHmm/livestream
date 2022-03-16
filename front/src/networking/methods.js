import store      from "@/store"
import { logger } from "@/utils"

export default  {

  report: {

    bytes_sent: ( { url, to, bytes } ) => {
      store.dispatch( 'networking/add_bytes_sent', { url, to, bytes } )
      // logger.info( 'NETWORK', `${ bytes } bytes sent to ${ to }.` )
    },
    bytes_received: ( { url, from, bytes } ) => {
      store.dispatch( 'networking/add_bytes_received', { url, from, bytes } )
      // logger.info( 'NETWORK', `${ bytes } bytes received from ${ from }.` )
    }

  }

}
