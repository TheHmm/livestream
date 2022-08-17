export default async function _throw( error ) {
  if ( error.stack ) {
    error.traces = error.stack
    .split('\n')
    .map( trace => trace.split('@') )
  }
  const { default: store } = await import('@/store')
  store.commit( 'meta/SET_ERROR', error )
}
