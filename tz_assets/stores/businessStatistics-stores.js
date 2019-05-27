import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
const qs = require('qs');

class BusinessStatisticsStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class BusinessStatisticssStores extends ActionBoundStores {
    @observable businessStatisticss = [

    ];
    filterData(param) {
        this.filterStoreData("businessStatisticss","select",param);
    }
    @observable detail = {};
    @action.bound
    getData(param={}) {
        this.changeRequestState(2);
        get("business/changemarket",param).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                const datas = res.data.data.info;
                this.businessStatisticss = datas.map(item => new BusinessStatisticsStores(item));
                this.detail = res.data.data;
            }
        });
    }
}
export default BusinessStatisticssStores;
