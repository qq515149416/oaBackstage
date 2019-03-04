import { observable, action, extendObservable } from "mobx";
import {get, post } from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');

class WorkOrderStores {
    constructor(data) {
        extendObservable(this, data);
    }
}
class DepartmentStores {
    constructor(data) {
        extendObservable(this, data);
    }
}

class WorkOrdersStores extends ActionBoundStores {
    @observable workOrderObj = {

    };
    @observable workOrders = [

    ];
    @observable department = [

    ];
    type = 0;
    delData(id) {
        return new Promise((resolve, reject) => {
            post("workorder/delete", {
                delete_id: id
            }).then((res) => {
                if (res.data.code == 1) {
                    this.delStoreData("workOrders", id);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    @action.bound
    getDepartments() {
        if (!this.department.length) {
            get("hr/show_depart").then(res => {
                if (res.data.code == 1) {
                    this.department = res.data.data.map(item => new DepartmentStores(item));
                }
            })
        }
    }
    @action.bound
    addData(data) {
        // this.workOrders[this.workOrders.findIndex(item => data.id == item.id)] = new WorkOrderStores(Object.assign(data, {
        //     resource_detail_json: JSON.parse(data.resource_detail)
        // }));
        for(let key in this.workOrderObj) {
            if(key != data.work_order_status && this.workOrderObj[key].find(item => item.id==data.id)) {
                this.workOrderObj[key].splice(this.workOrderObj[key].findIndex(item => item.id==data.id),1);
            }
        }
        if(!this.workOrderObj[data.work_order_status].find(item => data.id==item.id)) {
            this.workOrderObj[data.work_order_status].unshift(new WorkOrderStores(Object.assign(data, {
                resource_detail_json: JSON.parse(data.resource_detail)
            })));
        }
    }
    @action.bound
    getData(param = {}) {
        this.changeRequestState(2);
        this.workOrders = [];
        if (!param.work_order_status) {
            param.work_order_status = this.type;
        }
        this.workOrderObj[param.work_order_status] = [];
        get("workorder/show", param).then((res) => {
            this.changeRequestState(res.data.code);
            if (res.data.code == 1) {
                this.getDepartments();
                this.workOrders = res.data.data.map(item => new WorkOrderStores(Object.assign(item, {
                    resource_detail_json: JSON.parse(item.resource_detail)
                })));
                this.workOrderObj[param.work_order_status] = res.data.data.map(item => new WorkOrderStores(Object.assign(item, {
                    resource_detail_json: JSON.parse(item.resource_detail)
                })));
            }
        });
    }
}
export default WorkOrdersStores;
