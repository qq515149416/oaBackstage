import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class MemoryStores {
    constructor(data) {
        this.copyData = [];
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
class MemorysStores extends ActionBoundStores {
    @observable memorys = [

    ];
    @observable comprooms = [

    ];
    changeData(param) {
        return new Promise((resolve,reject) => {
            post("memory/edit",param).then((res) => {
                if(res.data.code==1) {
                    this.changeStoreData("memorys",MemoryStores,Object.assign(param,{
                        room: this.comprooms.find(item => item.roomid==param.room_id).machine_room_name,
                        updated_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss")
                    }));
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
            post("memory/deleted",{
                delete_id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("memorys",id);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    addData(data) {
        return new Promise((resolve,reject) => {
            post("memory/insert",data).then((res) => {
                if(res.data.code==1) {
                    this.addStoreData("memorys",MemoryStores,Object.assign(data,{
                        id: res.data.data,
                        room: this.comprooms.find(item => item.roomid==data.room_id).machine_room_name,
                        memory_used: "未使用",
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
        get("memory/memory_list").then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.memorys = res.data.data.map(item => new MemoryStores(item));
            }
        });
    }
}
export default MemorysStores;
