import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');

class DepartmentStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class DepartmentsStores extends ActionBoundStores {
    @observable departments = [

    ];
    sign_state = {
        "1": "普通",
        "2": "工单初始部门",
        "3": "工单处理部门"
    };
    delData(id) {
        return new Promise((resolve,reject) => {
            post("hr/delete_depart",{
                delete_id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("departments",id);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    changeData(param) {
        return new Promise((resolve,reject) => {
            post("hr/edit_depart",param).then((res) => {
                if(res.data.code==1) {
                    // this.getData();
                    this.changeStoreData("departments",DepartmentStores,Object.assign(param,{
                        sign_name: this.sign_state[param.sign],
                        created_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss"),
                        updated_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss")
                    }));
                    console.log(this.departments,Object.assign(param,{
                        sign_name: this.sign_state[param.sign],
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
    addData(data) {
        return new Promise((resolve,reject) => {
            post("hr/insert_depart",data).then((res) => {
                if(res.data.code==1) {
                    this.addStoreData("departments",DepartmentStores,Object.assign(data,{
                        id: res.data.data,
                        sign_name: this.sign_state[data.sign],
                        created_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss"),
                        updated_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss")
                    }));
                    resolve(true);
                } else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    @action.bound
    getData(param={}) {
        this.changeRequestState(2);
        this.departments = [];
        get("hr/show_depart").then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.departments = res.data.data.map(item => new DepartmentStores(item));
            }
        });
    }
}
export default DepartmentsStores;
