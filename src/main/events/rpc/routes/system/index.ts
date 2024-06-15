import { RPCRouter } from '~/events/rpc/router'
import appRoutes from '~/events/rpc/routes/system/app'
import windowRoutes from '~/events/rpc/routes/system/window'

const systemRouter = new RPCRouter()

const systemRoutes = [...appRoutes, ...windowRoutes]

systemRouter.addBatch(systemRoutes)

export { systemRouter }
