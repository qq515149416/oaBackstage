import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class InvoiceStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class InvoicesStores extends ActionBoundStores {
    @observable invoices = [

    ];
    changeData(param) {
        return new Promise((resolve,reject) => {
            // delete param.ip;
            post("invoice/payable/edit",param).then((res) => {
                if(res.data.code==1) {
                    this.getData({
                        user_id: param.user_id
                    });
                    resolve(true);
                }else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    addData(data) {
        return new Promise((resolve,reject) => {
            post("invoice/payable/insert",data).then((res) => {
                if(res.data.code==1) {
                    this.getData({
                        user_id: data.user_id
                    });
                    resolve(true);
                } else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    delData(id) {
        return new Promise((resolve,reject) => {
            post("invoice/payable/del",{
                payable_id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("invoices",id);
                    resolve(res);
                } else {
                    resolve(res);
                }
            }).catch(reject);
        });
    }
    @action.bound
    getData(param={}) {
        this.changeRequestState(2);
        this.invoices = [];
        get("invoice/payable/show",param).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.invoices = res.data.data.map(item => new InvoiceStores(item));
            }
        });
    }
}
export default InvoicesStores;
