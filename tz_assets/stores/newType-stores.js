import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
class NewTypeStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class NewTypesStores extends ActionBoundStores {
    @observable types = [

    ];
    delData(data) {
        return new Promise((resolve,reject) => {
            post("news_type/delete",data).then(res => {
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
    addData(data) {
        return new Promise((resolve,reject) => {
            post("news_type/insert",data).then(res => {
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
    changeData(data) {
        return new Promise((resolve,reject) => {
            post("news_type/edit",data).then(res => {
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
        get("news_type/show").then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.types = res.data.data.map(item => new NewTypeStores(item));
            }
        });
    }
}
export default NewTypesStores;
