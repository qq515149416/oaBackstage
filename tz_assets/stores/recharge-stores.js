import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const qs = require('qs');

class RechargeStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class RechargesStores extends ActionBoundStores {
    @observable recharge = [

    ];
    filterData(param) {
        this.filterStoreData("recharge","select",param);
    }
    @action.bound
    getData(param={}) {
        this.changeRequestState(2);
        let BASE_URL = "business/showRecharge";
        if(location.search.indexOf("?type=all") > -1) {
            BASE_URL = "business/showAllRecharge";
        }
        get(BASE_URL,param).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.recharge = res.data.data.map(item => new RechargeStores(item));
            }
        });
    }
}
export default RechargesStores;
