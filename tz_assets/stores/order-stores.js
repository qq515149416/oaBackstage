import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class OrderStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class ResourceStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class OrdersStores extends ActionBoundStores {
    @observable orders = [

    ];
    @observable resource =[

    ];
    type = null;
    delData(id) {
        return new Promise((resolve,reject) => {
            post("business/deleteorders",{
                delete_id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("orders",id);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    addData(data) {
        return new Promise((resolve,reject) => {
            post("business/insertresource",data).then(res => {
                if(res.data.code==1) {
                    // this.addStoreData("business",BusinesStores,Object.assign(JSON.parse(data.resource_detail),{
                    //     id: res.data.data
                    // }));
                    if(this.type) {
                        this.getData({
                            business_sn: data.business_sn,
                            resource_type: this.type
                        });
                    } else {
                        this.getData({
                            business_sn: data.business_sn
                        });
                    }

                    resolve(true);
                }else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    @action.bound
    getResourceData(param) {
        post("business/resource",param).then((res) => {
            if(res.data.code==1) {
                this.resource = res.data.data.map(item => new ResourceStores(item));
            }
        });
    }
    @action.bound
    getData(data) {
        this.changeRequestState(2);
        post("business/clerk",data).then(res => {
            this.changeRequestState(res.data.code);
            this.orders = [];
            if(res.data.code==1) {
                this.orders = res.data.data.map(item => new OrderStores(item));
            }
        });
    }
}
export default OrdersStores;
