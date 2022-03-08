import logger from "./logger"
import time from './time'
import livestream from './livestream'

function $id() {
  return this.$options?.name?.toLowerCase()
}

export {
  $id,
  logger,
  time,
  livestream
}
