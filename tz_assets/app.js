import React from "react";
import ReactDOM from "react-dom";
import route from "./config/route.js";
import route_config from "./config/route_config.js";
import {domIds} from "./config/common/config.js";
require('jquery');
$(function() {
    domIds.forEach(item => {
        if(document.getElementById(item)) {
            route(ReactDOM,route_config,item);
        }
    });
});
// window.addEventListener("unload",() => {
//     console.log("卸载了");
//     domIds.forEach(item => {
//         if(document.getElementById(item)) {
//             route(ReactDOM,route_config,item);
//         }
//     });
// });


