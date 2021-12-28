import createRouter from "router5"
import browserPlugin from "router5-plugin-browser"
import listenersPlugin from "router5-plugin-listeners"

import { ROUTES, ROUTE_ROOT } from "./routes"

const buildRouter = () => {
    const router = createRouter(ROUTES, {
        trailingSlash: true,
        defaultRoute: ROUTE_ROOT,
    })

    router.usePlugin(browserPlugin({ useHash: false }))
    router.usePlugin(listenersPlugin())

    return router
}

export default buildRouter
