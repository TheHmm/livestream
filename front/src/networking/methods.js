import store      from "@/store"
import $log from '@/utils/log'

export default  {

  report: {

    bytes_sent: ( { url, to, bytes } ) => {
      store.dispatch( 'networking/add_bytes_sent', { url, to, bytes } )
      // $log.info( 'NETWORK', `${ bytes } bytes sent to ${ to }.` )
    },
    bytes_received: ( { url, from, bytes } ) => {
      store.dispatch( 'networking/add_bytes_received', { url, from, bytes } )
      // $log.info( 'NETWORK', `${ bytes } bytes received from ${ from }.` )
    }

  }

}
