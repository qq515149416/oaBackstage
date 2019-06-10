import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
class DefenseipStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class DefenseipsStores extends ActionBoundStores {
    @observable defenseips = [

    ];
    delData(id) {
        return new Promise((resolve,reject) => {
            get("defenseip/store/del",{
                del_id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("defenseips",id);
                    resolve(res);
                } else {
                    resolve(res);
                }
            }).catch(reject);
        });
    }
    changeData(param) {
        return new Promise((resolve,reject) => {
            post("defenseip/store/edit",Object.assign(param,{
                edit_id: param.id
            })).then((res) => {
                if(res.data.code==1) {
                    this.getData({
                        status: 0,
                        site: 1
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
            post("defenseip/store/insert",data).then((res) => {
                if(res.data.code==1) {
                    this.getData({
                        status: 0,
                        site: 1
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
    getData(param={}) {
        this.changeRequestState(2);
        this.defenseips = [];
        get("defenseip/store/show",param).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.defenseips = res.data.data.map(item => new DefenseipStores(item));
            }
        });
    }
}
export default DefenseipsStores;
