import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router5";
import { ToastsContainer, ToastsStore } from "react-toasts";

import { RootComponent } from "./modules/root/ui/root-component";
import { buildStore } from "./build-store";
import buildRouter from "./modules/routing/build-router";

// image lightbox
import 'react-image-lightbox/style.css'

// import the newly created .scss file instead of the default Bootstrap .css in the beginning of your src/index.js file
import './custom.scss';

const router = buildRouter();
const store = buildStore(router);

router.start(() => {
    render(
        <RouterProvider router={router}>
            <Provider store={store}>
                <RootComponent />
            </Provider>
            <ToastsContainer autoclose={10000} store={ToastsStore} />
        </RouterProvider>,
        document.getElementById("root")
    );
});
