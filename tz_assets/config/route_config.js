import React from "react";
// import UsersList from "../view/usersList.jsx";
import ReactRouterConfig from "./reactRouterConfig.jsx";
import {domIds} from "./common/config.js";
const configData = domIds.map(item => ({
    id: item,
    routeDOM: document.getElementById(item),
    itemRoute: ReactRouterConfig
}));
export default configData;