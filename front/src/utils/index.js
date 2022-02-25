import logger from "./logger"
import network from "./network" 

  function $id() {
    return this.$options?.name?.toLowerCase()
  }

export {
  $id,
  logger,
  network,
}
