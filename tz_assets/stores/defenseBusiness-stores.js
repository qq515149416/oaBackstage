import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";

const qs = require('qs');

class DefenseBusinesStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class DefenseBusinessStores extends ActionBoundStores {
    @observable defenseBusiness = [

    ];
    addData(data) {
        return new Promise((resolve,reject) => {
            Object.assign(data,{
                customer_id: qs.parse(location.search.substr(1)).id
            });
            get("defenseip/order/buyNowByAdmin",data).then((res) => {
                if(res.data.code==1) {
                    if(qs.parse(location.search.substr(1)).email && qs.parse(location.search.substr(1)).id) {
                        this.getData({
                            customer_id: qs.parse(location.search.substr(1)).id
                        });
                    } else {
                        if(qs.parse(location.search.substr(1)).id) {
                            this.getData({
                                package_id: qs.parse(location.search.substr(1)).id
                            });
                        }
                    }
                    resolve(true);
                } else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    @action.bound
    getData(params = {}) {
        this.changeRequestState(2);
        let getUrl = "defenseip/remove/showBusinessByPackage";
        if(params.customer_id) {
            getUrl = "defenseip/remove/showBusinessByCustomer";
        }
        this.defenseBusiness = [];
        get(getUrl,{
            ...params
        }).then(res => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.defenseBusiness = res.data.data.map(item => new DefenseBusinesStores(item));
            }
        });
    }
}

export default DefenseBusinessStores;
