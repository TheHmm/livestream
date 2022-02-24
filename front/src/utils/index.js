const 

  sortEventsByDate = (arr) => {
    arr = Array.isArray(arr) ? arr : Object.values(arr)
    return arr.sort((a, b) => (
      new Date(a.ends) - new Date(b.ends)
    ))
  }

  function $id() {
    return this.$options?.name?.toLowerCase()
  }

export default {
  sortEventsByDate,
  $id,
}
