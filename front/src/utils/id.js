
// produce an id or class from a component name
// 'this' refers to the component instance

export default function $id( text ) {
  if ( text ) {
    return text.toLowerCase()
  } else {
    return this.$options?.name?.toLowerCase()
  }
}
