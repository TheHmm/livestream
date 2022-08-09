import store from "@/store"

export default  {

  report: {
    bytes_sent: ( { url, to, bytes } ) => {
      store.dispatch(
        'networking/add_bytes_sent',
        { url, to, bytes }
      )
    },
    bytes_received: ( { url, from, bytes } ) => {
      store.dispatch(
        'networking/add_bytes_received',
        { url, from, bytes }
      )
    }
  }

}
