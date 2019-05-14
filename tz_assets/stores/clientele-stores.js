import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class ClienteleStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class ClientelesStores extends ActionBoundStores {
    @observable clienteles = [

    ];
    filterData(param) {
        this.filterStoreData("clienteles","select",param);
    }
    bingSalesman(data) {
        let createClienteleApi = "business/register";
        if(data.isBinding=="1") {
            createClienteleApi = "business/insert_clerk";
        }
        if(data.isBinding=="0") {
            if(data.password != data.password_confirmation) {
                alert("密码不一致");
                return ;
            }
        }
        return new Promise((resolve,reject) => {
            post(createClienteleApi,data).then(res => {
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
    getData() {
        this.changeRequestState(2);
        this.clienteles = [];
        get("business/admin_customer").then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.clienteles = res.data.data.map(item => new ClienteleStores(item));
            }
        });
    }
}
export default ClientelesStores;
