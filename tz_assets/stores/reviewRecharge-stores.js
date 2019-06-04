import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const qs = require('qs');

class ReviewRechargeStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class ReviewRechargesStores extends ActionBoundStores {
    @observable reviewRecharges = [

    ];
    audit_status_dictionary = {
        "0": "待审核",
        "-1": "审核不通过",
        "1": "审核通过",
    }
    filterData(param) {
        this.filterStoreData("reviewRecharges","select",param);
    }
    @action.bound
    getData(param={}) {
        this.changeRequestState(2);
        let BASE_URL = "business/showAuditRechargeBig";
        if(location.search.indexOf("?type=check") > -1) {
            BASE_URL = "business/showAuditRechargeSmall";
        }
        get(BASE_URL,param).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.reviewRecharges = res.data.data.map(item => new ReviewRechargeStores(Object.assign(item,{
                    audit_status_name: this.audit_status_dictionary[item.audit_status+""]
                })));
            }
        });
    }

}
export default ReviewRechargesStores;
