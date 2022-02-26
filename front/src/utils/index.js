import logger from "./logger"
import time from './time'
import network from "./network" 

function $id() {
  return this.$options?.name?.toLowerCase()
}

export {
  $id,
  logger,
  time,
  network,
}
