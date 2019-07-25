import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class BusinesStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class BusinessStores extends ActionBoundStores {
    @observable business = [

    ];
    @observable business_all = [

    ];
    status = {"1": "审核通过", "-2": "审核不通过"};
    @observable statistics = {
        clientName: "",
        unitPrice: 0,
        length: 0,
        businessType: "租用主机",
        productName: "",
        statisticsAmount: 0
    };
    filterData(param) {
        this.filterStoreData("business","select",param);
    }
    @action.bound
    changeStatistics(attr,value) {
        this.statistics.statisticsAmount = this.statistics.unitPrice * this.statistics.length;
        this.statistics[attr] = value;
    }
    checkAll(data) {
        return new Promise((resolve,reject) => {
            post("business/check",data).then((res) => {
                if(res.data.code==1) {
                    this.changeStoreData("business",BusinesStores,Object.assign(data,{
                        status: this.status[data.business_status+""]
                    }));
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    delData(id) {
        return new Promise((resolve,reject) => {
            post("business/deletebusiness",{
                delete_id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("business",id);
                    resolve(res);
                } else {
                    resolve(res);
                }
            }).catch(reject);
        });
    }
    addData(data) {
        if(isNaN(data.length)) {
            alert("时长只能填数字");
            return ;
        }
        return new Promise((resolve,reject) => {
            post("business/insert",data).then(res => {
                if(res.data.code==1) {
                    // this.addStoreData("business",BusinesStores,Object.assign(JSON.parse(data.resource_detail),{
                    //     id: res.data.data
                    // }));
                    this.getData(data.client_id);
                    resolve(true);
                }else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    @action.bound
    getAllData() {
        this.changeRequestState(2);
        get("business/security").then(res => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.business = res.data.data.map(item => new BusinesStores(Object.assign(item,{
                    resource_detail_json: JSON.parse(item.resource_detail)
                })));
            }
        });
    }
    @action.bound
    getData(id,business_type) {
        this.changeRequestState(2);
        get("business/showbusiness",{
            client_id: id,
            business_type
        }).then(res => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.business = res.data.data.map(item => new BusinesStores(Object.assign(item,{
                    resource_detail_json: JSON.parse(item.resource_detail)
                })));
                this.business_all = res.data.data.map(item => new BusinesStores(Object.assign(item,{
                    resource_detail_json: JSON.parse(item.resource_detail)
                })));
            }
        });
    }
    @action.bound
    findData({ business_status }) {
        if(business_status!="all") {
            this.business = this.business_all.filter(item => item.business_status == business_status);
        } else {
            this.business = this.business_all;
        }
    }
}
export default BusinessStores;
