import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";



class OverlayStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class OverlaysStores extends ActionBoundStores {
    @observable overlays = [

    ];
    site = 39
    delData(id) {
        return new Promise((resolve,reject) => {
            post("overlay/del",{
                del_id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("overlays",id);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    changeData(param) {
        return new Promise((resolve,reject) => {
            post("overlay/edit",Object.assign(param,{
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
            post("overlay/insert",data).then((res) => {
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
        if(!param.sell_status) {
            param.sell_status = "*";
        }
        this.changeRequestState(2);
        this.overlays = [];
        get("overlay/show",param).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.overlays = res.data.data.map(item => new OverlayStores(item));
            }
        });
    }
}
export default OverlaysStores;
