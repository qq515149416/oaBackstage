import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class WorkOrderTypeStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class WorkOrderTypesStores extends ActionBoundStores {
    @observable workOrderTypes = [

    ];
    delData(data) {
        return new Promise((resolve,reject) => {
            post("worktype/delete",data).then(res => {
                if(res.data.code==1) {
                    this.getData();
                    resolve(res);
                }else {
                    // alert(res.data.msg);
                    resolve(res);
                }
            }).catch(reject);
        });
    }
    addData(data) {
        return new Promise((resolve,reject) => {
            post("worktype/insert",data).then(res => {
                if(res.data.code==1) {
                    this.getData();
                    resolve(true);
                }else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    changeData(data) {
        return new Promise((resolve,reject) => {
            post("worktype/edit",data).then(res => {
                if(res.data.code==1) {
                    this.getData();
                    resolve(true);
                }else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    @action.bound
    expand(id) {
        this.workOrderTypes = this.workOrderTypes.map(item => {
            if(item.id==id) {
                item.more = !item.more;
            }
            return item;
        });
    }
    @action.bound
    getData(param={}) {
        this.changeRequestState(2);
        this.workOrderTypes = [];
        get("worktype/show",param).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.workOrderTypes = res.data.data.map(item => new WorkOrderTypeStores(Object.assign(item,{
                    more: false
                })));
            }
        });
    }
}
export default WorkOrderTypesStores;
