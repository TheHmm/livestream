import logger from "./logger"
import time from './time'

function $id() {
  return this.$options?.name?.toLowerCase()
}

export {
  $id,
  logger,
  time,
}
