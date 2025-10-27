export default function $throttle(func, delay, skip_func) {
  if ( skip_func ) {
    skip_func()
  }
  let lastCall = 0
  return function (...args) {
    const now = new Date().getTime()
    if (now - lastCall >= delay) {
      lastCall = now
      func.apply(this, args)
    }
  }
}