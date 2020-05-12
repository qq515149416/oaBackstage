import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";

const qs = require('qs');

class OverlayBusinessStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class OverlayBusinesssStores extends ActionBoundStores {
    @observable overlayBusiness = [

    ];
    type = "*";
    addData(data) {
        return new Promise((resolve,reject) => {
            Object.assign(data,{
                user_id: qs.parse(location.search.substr(1)).id
            });
            if(!data.price) {
                delete data.price;
            }
            post("overlay/buyNowByAdmin",data).then((res) => {
                if(res.data.code==1) {
                    this.getData({
                        user_id: qs.parse(location.search.substr(1)).id,
                        status: this.type
                    });
                    resolve(res.data.data);
                } else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    @action.bound
    getData(params = {}) {
        this.changeRequestState(2);
        let getUrl = "overlay/showBelong";
        this.overlayBusiness = [];
        get(getUrl,{
            ...params
        }).then(res => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.overlayBusiness = res.data.data.map(item => new OverlayBusinessStores(item));
            }
        });
    }
}

export default OverlayBusinesssStores;
