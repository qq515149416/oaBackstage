import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class UserStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class UsersStores extends ActionBoundStores {
    @observable users = [

    ];
    filterData(param) {
        this.filterStoreData("users","select",param);
    }
    addData(data) {
        return new Promise((resolve,reject) => {
            post("hr/insert_account",data).then((res) => {
                if(res.data.code==1) {
                    this.addStoreData("users",UserStores,Object.assign(data,{
                        id: res.data.data,
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
        this.users = [];
        this.changeRequestState(2);
        get("hr/show_account",param).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.users = res.data.data.map(item => new UserStores(item));
            }
        });
    }
}
export default UsersStores;
