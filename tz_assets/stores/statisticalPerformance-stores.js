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
    @observable statisticalPerformanceInfo = {

    };
    business_type = 1
    @action.bound
    getData(param={}) {
        this.changeRequestState(2);
        let url = 'pfmStatistics/pfmBig';
        if(location.search.indexOf("?type=recharge") > -1) {
            url = 'rechargeStatistics/list';
        }
        if(location.search.indexOf("?type=all") > -1) {
            url = 'pfmStatistics/performance';
        }
        if(location.search.indexOf("business_id=") > -1) {
            url = 'business/performanceorder';
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
                if(location.search.indexOf("?type=all") > -1) {
                    this.statisticalPerformances = res.data.data.count.map(item => {
                        item.business_id = item.id;
                        item.begin = param.begin || 'null';
                        item.end = param.end || 'null';
                        item.type = item.id ? 'oreder' : 'sum';
                        return new StatisticalPerformanceStores(item);
                    });
                    this.statisticalPerformanceInfo = res.data.data;
                } else {
                    this.statisticalPerformances = res.data.data.map(item => new StatisticalPerformanceStores(item));
                }
            }
        });
    }
}
export default StatisticalPerformancesStores;
