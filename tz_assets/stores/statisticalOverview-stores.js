import { observable, action, extendObservable} from "mobx";
import { get } from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');


class StatisticalOverviewStores extends ActionBoundStores {
    @observable statisticalOverview = {
        recharge: {
            day: 0,
            month: 0,
            nextMonth: 0
        },
        consumption: {
            day: 0,
            month: 0,
            nextMonth: 0
        },
        customer: {
            day: 0,
            month: 0,
            nextMonth: 0
        },
        machine: {
            today_on: 0,
            this_month_on: 0,
            this_month_down: 0
        }
    };
    @action.bound
    getChartData(param={}) {
        get("rechargeStatistics/rechargeTwelve",param).then(res => {
            if(res.data.code==1) {
                this.statisticalOverview["rechargeTwelve"] = res.data.data;
            }
        });
        get("pfmStatistics/consumptionTwelve",param).then(res => {
            if(res.data.code==1) {
                this.statisticalOverview["consumptionTwelve"] = res.data.data;
            }
        });
        get("statistics/getMachineNum",param).then(res => {
            if(res.data.code==1) {
                this.statisticalOverview["machine"] = res.data.data;
            }
        });
    }
    @action.bound
    getData(param={}) {
        const dateAttr = ["day","month","nextMonth"];
        const index = param["need"] ? param["need"] - 1 : 0;
        [{
            url: "rechargeStatistics/getRecharge",
            stores: "recharge"
        },{
            url: "pfmStatistics/getConsumption",
            stores: "consumption"
        },{
            url: "users/getUsers",
            stores: "customer"
        }].forEach(item => {
            get(item.url,param).then(res => {
                if(res.data.code==1) {
                    this.statisticalOverview[item.stores][dateAttr[index]] = res.data.data;
                }
            });
        });
    }
}
export default StatisticalOverviewStores;
