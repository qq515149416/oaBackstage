import { observable, action} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class CpuStores {
    @observable id =  1;
    @observable cpu_number =  "";
    @observable cpu_param ="";
    @observable cpu_used = "";
    @observable room = "";
    @observable room_id = 1;
    @observable created_at = "";
    @observable updated_at = "";
    constructor({id, cpu_number, cpu_param, cpu_used, room, room_id, created_at, updated_at}) {
        Object.assign(this,{
            id,
            cpu_number,
            cpu_param,
            cpu_used,
            room,
            room_id,
            created_at,
            updated_at
        });
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
class CpusStores extends ActionBoundStores {
    @observable cpus = [

    ];
    @observable comprooms = [

    ];
    changeData(param) {
        return new Promise((resolve,reject) => {
            post("cpu/edit",param).then((res) => {
                if(res.data.code==1) {
                    this.changeStoreData("cpus",CpuStores,Object.assign(param,{
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
            post("cpu/deleted",{
                delete_id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("cpus",id);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    addData(data) {
        return new Promise((resolve,reject) => {
            post("cpu/insert",data).then((res) => {
                if(res.data.code==1) {
                    this.addStoreData("cpus",CpuStores,Object.assign(data,{
                        id: res.data.data,
                        room: this.comprooms.find(item => item.roomid==data.room_id).machine_room_name,
                        cpu_used: "未使用",
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
        get("cpu/cpu_list").then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.cpus = res.data.data.map(item => new CpuStores({
                    ...{
                        id: item.id,
                        cpu_number: item.cpu_number,
                        cpu_param: item.cpu_param,
                        cpu_used: item.cpu_used,
                        room: item.room,
                        room_id: item.room_id,
                        created_at: item.created_at || dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss"),
                        updated_at: item.updated_at || dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss")
                    }
                }));
            }
        });
    }
}
export default CpusStores;
