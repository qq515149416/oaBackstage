import { observable, action, extendObservable } from "mobx";
import {get, post } from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class OrderStores {
    constructor(data) {
        extendObservable(this, data);
    }
}
class ResourceStores {
    constructor(data) {
        extendObservable(this, data);
    }
}
class OrdersStores extends ActionBoundStores {
    @observable orders = [

    ];
    @observable resource = [

    ];
    type = null;
    delData(id) {
        return new Promise((resolve, reject) => {
            post("business/deleteorders", {
                delete_id: id
            }).then((res) => {
                if (res.data.code == 1) {
                    this.delStoreData("orders", id);
                    resolve(res);
                } else {
                    resolve(res);
                }
            }).catch(reject);
        });
    }
    addData(data) {
        return new Promise((resolve, reject) => {
            console.log(data);
            if (Array.isArray(data.resource)) {
                const request = data.resource.map(item => {
                    return post("business/insertresource", Object.assign(data, {
                        resource_id: item.value.id,
                        machine_sn: item.value.label,
                        resource: item.value.value
                    }));
                });
                Promise.all(request).then(results => {
                    if (this.type) {
                        this.getData({
                            business_sn: data.business_sn,
                            resource_type: this.type
                        });
                    } else {
                        this.getData({
                            business_sn: data.business_sn
                        });
                    }
                    const errors = results.filter(item => item.data.code !== 1);
                    // console.log(errors);
                    if(errors.length) {
                        let messages = "";
                        errors.forEach(item => {
                            messages += item.data.msg+"，";
                        });
                        alert("请求错误共"+errors.length+"个，错误为："+messages);
                    } else {
                        alert("请求完成");
                    }
                    resolve(true);
                });

            } else {
                post("business/insertresource", data).then(res => {
                    if (res.data.code == 1) {
                        // this.addStoreData("business",BusinesStores,Object.assign(JSON.parse(data.resource_detail),{
                        //     id: res.data.data
                        // }));
                        if (this.type) {
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
                    } else {
                        alert(res.data.msg);
                        resolve(false);
                    }
                }).catch(reject);
            }

        });
    }
    @action.bound
    getResourceData(param) {
        post("business/resource", param).then((res) => {
            if (res.data.code == 1) {
                this.resource = res.data.data.map(item => new ResourceStores(item));
            }
        });
    }
    @action.bound
    getData(data) {
        this.changeRequestState(2);
        post("business/clerk", data).then(res => {
            this.changeRequestState(res.data.code);
            this.orders = [];
            if (res.data.code == 1) {
                this.orders = res.data.data.map(item => new OrderStores(item));
            }
        });
    }
}
export default OrdersStores;
