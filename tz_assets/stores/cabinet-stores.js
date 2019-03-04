import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class CabinetStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class ComproomStores {
    @observable machine_room_id = "";
    @observable machine_room_name = "";
    @observable roomid = 1;
    constructor({machine_room_id,machine_room_name,roomid}) {
        Object.assign(this,{
            machine_room_id,
            machine_room_name,
            roomid
        });
    }
}
class CabinetsStores extends ActionBoundStores {
    @observable cabinets = [

    ];
    @observable comprooms = [

    ];
    stateText(state,codes) {
        return codes[state];
    }
    filterData(param) {
        this.filterStoreData("cabinets","select",param);
    }
    delData(id) {
        return new Promise((resolve,reject) => {
            post("cabinet/destroyByAjax",{
                id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("cabinets",id);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    changeData(param) {
        return new Promise((resolve,reject) => {
            post("cabinet/updateByAjax",param).then((res) => {
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
            post("cabinet/storeByAjax",data).then((res) => {
                if(res.data.code==1) {
                    this.addStoreData("cabinets",CabinetStores,Object.assign(data,{
                        id: res.data.data,
                        use_type_cn: this.stateText(String(data.use_type),{
                            "0" : "内部机柜",
                            "1": "客户机"
                        }),
                        machine_count: 0,
                        use_state_cn: "未使用",
                        machine_room_name: this.comprooms.find(item => item.roomid==data.machineroom_id).machine_room_name,
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
    getData() {
        this.changeRequestState(2);
        get("ips/machineroom").then((res) => {
            if(res.data.code==1) {
                this.comprooms = res.data.data.map(item => new ComproomStores(item));
            }
        });
        get("cabinet/showByAjax").then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.cabinets = res.data.data.map(item => new CabinetStores(item));
                console.log(this.cabinets);
            }
        });
    }
}
export default CabinetsStores;
