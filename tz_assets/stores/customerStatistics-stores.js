import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
const qs = require('qs');

class CustomerStatisticsStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class CustomerStatisticssStores extends ActionBoundStores {
    @observable customerStatisticss = [

    ];
    @observable detail = {};
    type = "new"
    @action.bound
    getData(param={}) {
        this.changeRequestState(2);
        const urls = {
            new: "business/new_business",
            obtained: "business/under_business",
            client: "business/new_registration"
        };
        get(urls[this.type],param).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                const datas = res.data.data.business || res.data.data.info;
                this.customerStatisticss = datas.map(item => new CustomerStatisticsStores(item));
                this.detail = res.data.data;
            }
        });
    }
}
export default CustomerStatisticssStores;
