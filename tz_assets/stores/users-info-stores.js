import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
class UserInfoStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class UsersInfoStores extends ActionBoundStores {
    @observable user = [

    ];
    @action.bound
    getData() {
        this.changeRequestState(2);
        get("staff/staff_list").then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                console.log(res.data);
                this.user = res.data.data.map(item => new UserInfoStores({
                    ...item
                }));
            }
        });
    }
}
export default UsersInfoStores;
