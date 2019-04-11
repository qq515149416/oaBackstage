import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class MachineRoomStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class MachineRoomsStores extends ActionBoundStores {
    @observable machineRooms = [

    ];
    delData(id) {
        return new Promise((resolve,reject) => {
            post("machine_room/destroyByAjax",{
                id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("machineRooms",id);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    changeData(param) {
        return new Promise((resolve,reject) => {
            post("machine_room/updateByAjax",param).then((res) => {
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
            post("machine_room/storeByAjax",data).then((res) => {
                if(res.data.code==1) {
                    this.addStoreData("machineRooms",MachineRoomStores,{
                        machine_room_id: data.room_id,
                        machine_room_name: data.room_name,
                        list_order: data.list_order,
                        created_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss"),
                        updated_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss")
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
    getData(callbrak) {
        this.changeRequestState(2);
        get("machine_room/showByAjax").then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.machineRooms = res.data.data.map(item => new MachineRoomStores(item));
                callbrak && callbrak(res.data.data);
            }
        });
    }
}
export default MachineRoomsStores;
