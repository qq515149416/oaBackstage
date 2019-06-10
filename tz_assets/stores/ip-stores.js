import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class IpStores {
    constructor(data) {
        this.copyData = [];
        extendObservable(this,data);
    }
}
class ComproomStores {
    @observable machine_room_id = "";
    @observable machine_room_name = "";
    @observable roomid = 1;
    constructor({machine_room_id,machine_room_name,roomid}) {
        Object.assign(this,{
            machine_room_id,
            machine_room_name,
            roomid
        });
    }
}
class IpsStores extends ActionBoundStores {
    @observable ips = [

    ];
    @observable pageData = {

    };
    @observable comprooms = [

    ];
    // page = "pageData";
    stateText(state,codes) {
        return codes[state];
    }
    filterData(param) {
        this.filterStoreData("ips","select",param);
    }
    changeData(param) {
        return new Promise((resolve,reject) => {
            // delete param.ip;
            param.ip_start = param.ip;
            post("ips/alerting",param).then((res) => {
                if(res.data.code==1) {
                    this.changeStoreData("ips",IpStores,Object.assign(param,{
                        ip_company: this.stateText(String(param.ip_company),{
                            "0" : "电信公司",
                            "1": "移动公司",
                            "2": "联通公司"
                        }),
                        ip_status: this.stateText(String(param.ip_status),{
                            "0" : "未使用",
                            "1": "使用(子IP)",
                            "2": "使用(内部机器主IP)",
                            "3": "使用(托管主机的主IP)"
                        }),
                        ip_lock: this.stateText(String(param.ip_lock),{
                            "0" : "未锁定",
                            "1": "锁定"
                        }),
                        ip_comproomname: this.comprooms.find(item => item.roomid==param.ip_comproom).machine_room_name,
                        created_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss"),
                        updated_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss")
                    }));
                    resolve(true);
                }else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    delData(id) {
        return new Promise((resolve,reject) => {
            post("ips/remove",{
                delete_id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("ips",id);
                    resolve(res);
                } else {
                    resolve(res);
                }
            }).catch(reject);
        });
    }
    addData(data) {
        return new Promise((resolve,reject) => {
            post("ips/insert",data).then((res) => {
                if(res.data.code==1) {
                    this.addStoreData("ips",IpStores,Object.assign(data,{
                        id: res.data.data,
                        ip: data.ip_start,
                        ip_company: this.stateText(String(data.ip_company),{
                            "0" : "电信公司",
                            "1": "移动公司",
                            "2": "联通公司"
                        }),
                        ip_status: this.stateText(String(data.ip_status),{
                            "0" : "未使用",
                            "1": "使用(子IP)",
                            "2": "使用(内部机器主IP)",
                            "3": "使用(托管主机的主IP)"
                        }),
                        ip_lock: this.stateText(String(data.ip_lock),{
                            "0" : "未锁定",
                            "1": "锁定"
                        }),
                        ip_comproomname: this.comprooms.find(item => item.roomid==data.ip_comproom).machine_room_name,
                        created_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss"),
                        updated_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss")
                    }));
                    resolve(true);
                }else if(res.data.code==2) {
                    this.getData();
                    resolve(true);
                } else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    @action.bound
    getPageData(page) {
        this.getData({
            page
        });
    }
    @action.bound
    getData(param = {}) {
        this.changeRequestState(2);
        get("ips/machineroom").then((res) => {
            if(res.data.code==1) {
                this.comprooms = res.data.data.map(item => new ComproomStores(item));
            }
        });
        get("ips/index",param).then((res) => {
            this.changeRequestState(res.data.code);
            // pageData
            if(res.data.code==1) {
                this.ips = res.data.data.map(item => new IpStores(item));
                // this.pageData = res.data.data;
            }
        });
    }
}
export default IpsStores;
