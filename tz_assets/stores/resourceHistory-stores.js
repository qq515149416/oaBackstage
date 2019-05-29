import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const qs = require('qs');

class ResourceHistoryStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class ResourceHistorysStores extends ActionBoundStores {
    @observable resourceHistorys = [

    ];
    @action.bound
    getData(param={}) {
        this.changeRequestState(2);
        let BASE_URL = "business/getchange";
        get(BASE_URL,param).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.resourceHistorys = res.data.data.map(item => new ResourceHistoryStores(item));
            }
        });
    }
}
export default ResourceHistorysStores;
