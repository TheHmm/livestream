
const
  
  _throw = async error => {
    const { default: store } = await import('@/store')

    if ( error.stack ) {
      error.traces = error.stack
      .split('\n')
      .map( trace => trace.split('@') )
    }
    
    store.commit( 'ui/SET_ERROR', error )
    
    return {
      name: 'Error',
      query: { type: error.message },
    }
    
  }
  
export default _throw
