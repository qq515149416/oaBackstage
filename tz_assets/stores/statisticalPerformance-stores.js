import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
const qs = require('qs');
class StatisticalPerformanceStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class StatisticalPerformancesStores extends ActionBoundStores {
    @observable statisticalPerformances = [

    ];
    business_type = 1
    @action.bound
    getData(param={}) {
        this.changeRequestState(2);
        let url = 'pfmStatistics/pfmBig';
        if(location.search.indexOf("?type=recharge") > -1) {
            url = 'rechargeStatistics/list';
        }
        if(location.search.indexOf("?id") > -1) {
            param["customer_id"] = qs.parse(location.search.substr(1)).id;
        }
        this.statisticalPerformances = [];
        get(url,Object.assign(param,{
            business_type: this.business_type
        })).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.statisticalPerformances = res.data.data.map(item => new StatisticalPerformanceStores(item));
            }
        });
    }
}
export default StatisticalPerformancesStores;
