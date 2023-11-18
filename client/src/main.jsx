import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter} from "react-router-dom";
import {RouterProvider} from "react-router";
import "@styles/fonts.sass";
import "@styles/main.sass";
import Root from "@/common/layouts/Root";
import Home from "@/pages/Home";
import Imprint from "@/pages/Imprint";
import Privacy from "@/pages/Privacy";
import Create from "@/pages/Create";
import Join from "@/pages/Join";
import Game from "@/pages/Game";
import End from "@/pages/End";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        children: [
            {path: "/", element: <Home/>},
            {path: "/imprint", element: <Imprint/>},
            {path: "/privacy", element: <Privacy/>},
            {path: "/create", element: <Create/>},
            {path: "/join", element: <Join/>},
            {path: "/join/:code", element: <Join/>},
            {path: "/game", element: <Game/>},
            {path: "/end", element: <End/>},
            {
                path: "*",
                element: <div style={{display: "flex", justifyContent: "center"}}>404 - Seite nicht gefunden</div>,
            },
        ],
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={routes}/>
    </React.StrictMode>,
)
