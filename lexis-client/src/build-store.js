import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { router5Middleware } from "redux-router5";
import createSagaMiddleware from "redux-saga";

import { rootReducer } from "./modules/root/root-reducer";
import { rootSaga } from "./modules/root/root-saga";

export const buildStore = router => {
    const sagaMiddleware = createSagaMiddleware();

    const middleware = applyMiddleware(sagaMiddleware, router5Middleware(router))

    const devTools =
    process.env.NODE_ENV === "production"
        ? middleware
        : composeWithDevTools(middleware)

    const store = createStore(rootReducer, devTools)


    sagaMiddleware.run(rootSaga);

    return store;
};
