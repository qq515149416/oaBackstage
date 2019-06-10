import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";



class DefensePackageStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class DefensePackagesStores extends ActionBoundStores {
    @observable defensePackages = [

    ];
    site = 39
    delData(id) {
        return new Promise((resolve,reject) => {
            get("defenseip/package/del",{
                del_id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("defensePackages",id);
                    resolve(res);
                } else {
                    resolve(res);
                }
            }).catch(reject);
        });
    }
    changeData(param) {
        return new Promise((resolve,reject) => {
            post("defenseip/package/edit",Object.assign(param,{
                edit_id: param.id
            })).then((res) => {
                if(res.data.code==1) {
                    this.getData({
                        site: this.site
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
            post("defenseip/package/insert",data).then((res) => {
                if(res.data.code==1) {
                    this.getData({
                        site: this.site
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
        if(!param.site) {
            param.site = this.site;
        }
        this.changeRequestState(2);
        this.defensePackages = [];
        get("defenseip/package/show",param).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.defensePackages = res.data.data.map(item => new DefensePackageStores(item));
            }
        });
    }
}
export default DefensePackagesStores;
