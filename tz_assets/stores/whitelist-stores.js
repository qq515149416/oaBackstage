import { observable, action, extendObservable } from "mobx";
import {get, post } from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class WhitelistStores {
    constructor(data) {
        // console.log(Object.keys(data).map(key => {
        //     return typeof data[key];
        // }));
        extendObservable(this, data);
    }
}
class WhitelistsStores extends ActionBoundStores {
    @observable whitelists = [

    ];
    @observable binding_machine = "";
    @observable customer_id = "";
    @observable customer_name = "";
    status = {"1": "审核通过", "2": "审核不通过", "3": "黑名单"};
    type = 0;
    delData(id) {
        return new Promise((resolve, reject) => {
            post("whitelist/delete", {
                delete_id: id,
                method: "deleteWhiteList"
            }).then((res) => {
                if (res.data.code == 1) {
                    this.delStoreData("whitelists", id);
                    resolve(res);
                } else {
                    resolve(res);
                }
            }).catch(reject);
        });
    }
    filterData(param) {
        this.filterStoreData("whitelists","select",param);
    }
    checkAll(data) {
        return new Promise((resolve,reject) => {
            post("whitelist/check",data).then((res) => {
                if(res.data.code==1) {
                    this.changeStoreData("whitelists",WhitelistStores,Object.assign(data,{
                        status: this.status[data.white_status],
                        white_status: data.white_status
                    }));
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    addData(data) {
        let reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
        return new Promise((resolve, reject) => {
            if((!reg.test(data.domain_name)) || data.domain_name.indexOf("www") > -1) {
                alert("域名不能携带http和www");
                resolve(false);
                return ;
            }
            post("whitelist/insert", Object.assign(data, {
                binding_machine: this.binding_machine,
                customer_id: this.customer_id,
                customer_name: this.customer_name,
                method: "insertWhiteList"
            })).then(res => {
                if (res.data.code == 1) {
                    this.getData({
                        white_status: this.type
                    });
                    resolve(true);
                } else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    @action.bound
    handleChange(param) {
        if (param.binding_machine) {
            this.binding_machine = param.binding_machine;
        }
        if (param.customer_name) {
            this.customer_name = param.customer_name;
        }
        if (param.customer_id) {
            this.customer_id = param.customer_id;
        }
    }
    @action.bound
    getIpParam(ip) {
        get("whitelist/checkIP", {
            ip,
            method: "checkIP"
        }).then((res) => {
            if (res.data.code == 1) {
                this.binding_machine = res.data.data.machine_number;
                this.customer_name = res.data.data.customer_name;
                this.customer_id = res.data.data.customer_id;
                // this.handleChange(res.data.data);
            }
        });
    }
    @action.bound
    getData(param = {}) {
        this.changeRequestState(2);
        this.whitelists = [];
        get("whitelist/show", Object.assign(param, {
            method: "showWhiteList"
        })).then((res) => {
            this.changeRequestState(res.data.code);
            if (res.data.code == 1) {
                // console.log(res.data.data.length);
                // res.data.data.map(item => new WhitelistStores(item)).forEach((item,index) => {
                //     this.whitelists[index] = item;
                // });
                this.whitelists = res.data.data.map(item => new WhitelistStores(item));
                // this.whitelists = data_start.concat(data_end);
                // console.log(res.data.data.filter((item,index) => index == 9999));
                // console.log(this.whitelists);
            }
        });
    }
}
export default WhitelistsStores;
