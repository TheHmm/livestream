import { createRouter } from 'vue-router'
import history          from './history'
import routes           from './routes'
import guards           from './guards'

const 
  router = createRouter( {
    history,
    routes,
  } )

  router.beforeEach( guards.before_each )


export default router
