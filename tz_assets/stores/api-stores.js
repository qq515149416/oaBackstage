import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');


class ApiStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class ApisStores extends ActionBoundStores {
    @observable apis = [

    ];
    @action.bound
    getData(state=2) {
        this.changeRequestState(2);
        get("api/show",{
            state
        }).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.apis = res.data.data.map(item => new ApiStores(item));
            }
        });
    }
}
export default ApisStores;
