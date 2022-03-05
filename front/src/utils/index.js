import logger from "./logger"
import time from './time'
import mux from './mux'

function $id() {
  return this.$options?.name?.toLowerCase()
}

export {
  $id,
  logger,
  time,
  mux
}
