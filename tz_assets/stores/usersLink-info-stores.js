import { observable, action} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class UserLinkInfoStores {
    @observable id = 1;
    @observable contactname =  "";
    @observable qq ="";
    @observable mobile = "";
    @observable email = "";
    @observable rank = "";
    @observable site = "";
    @observable created_at = "";
    @observable updated_at = "";
    constructor({id,contactname, qq, mobile, email, rank, site, created_at = dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss"), updated_at = dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss")}) {
        if(!isNaN(site)) {
            let siteText = "";
            switch(site) {
                case 1:
                    siteText = "左侧";
                break;
                case 2:
                    siteText = "联系人页面";
                break;
                case 3:
                    siteText = "两侧均显示";
                break;
            }
            site = siteText;
        }

        Object.assign(this,{
            id,
            contactname,
            qq,
            mobile,
            email,
            rank,
            site,
            created_at,
            updated_at
        });
    }
}
class UsersLinkInfoStores extends ActionBoundStores {
    @observable user = [

    ];
    changeData(param) {
        return new Promise((resolve,reject) => {
            post("contacts/alerting",param).then((res) => {
                if(res.data.code==1) {
                    this.changeStoreData("user",UserLinkInfoStores,param);
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
            post("contacts/remove",{
                delete_id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("user",id);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    addData(data) {
        return new Promise((resolve,reject) => {
            post("contacts/insert",{
                contactname: data.contactname,
                qq: data.qq,
                mobile: data.mobile,
                email: data.email,
                rank: data.rank,
                site: data.site
            }).then((res) => {
                if(res.data.code==1) {
                    // this.user.push(new UserLinkInfoStores(data));
                    this.addStoreData("user",UserLinkInfoStores,data);
                    resolve(true);
                } else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    @action.bound
    getData() {
        this.changeRequestState(2);
        get("contacts/list").then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.user = res.data.data.map(item => new UserLinkInfoStores({
                    ...item
                }));
            }
        });
    }

}
export default UsersLinkInfoStores;
