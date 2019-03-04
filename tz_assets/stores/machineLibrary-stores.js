import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class MachineLibraryStores {
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
class IpsStores {
    @observable ipid = 1;
    @observable ip = "";
    constructor({ipid,ip}) {
        Object.assign(this,{
            ipid,
            ip
        });
    }
}
class CabinetStores {
    @observable cabinetid = 1;
    @observable cabinet_id = "";
    constructor({cabinetid,cabinet_id}) {
        Object.assign(this,{
            cabinetid,
            cabinet_id
        });
    }
}
class MachineLibrarysStores extends ActionBoundStores {
    @observable machineLibrarys = [

    ];
    @observable comprooms = [

    ];
    @observable cabinets = [

    ];
    @observable ips = [

    ];
    @observable type = 1;
    filterData(param) {
        this.copyData = this.machineLibrarys;
        this.filterStoreData("machineLibrarys","select",param);
    }
    changeData(param) {
        // param.business_type = this.type;
        return new Promise((resolve,reject) => {
            post("machine/editmachine",param).then((res) => {
                if(res.data.code==1) {
                    this.getData(this.type);
                    resolve(true);
                }else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    addData(data) {
        // data.business_type = this.type;
        return new Promise((resolve,reject) => {
            post("machine/insertmachine",data).then((res) => {
                if(res.data.code==1) {
                    this.getData(this.type);
                    resolve(true);
                } else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    delData(id) {
        return new Promise((resolve,reject) => {
            post("machine/deletemachine",{
                delete_id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("machineLibrarys",id);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    @action.bound
    getIpsData(param) {
        get("machine/ips",param).then((res) => {
            if(res.data.code==1) {
                this.ips = res.data.data.map(item => new IpsStores(item));
            }
        });
    }
    @action.bound
    getCabinetsData(param) {
        param.business_type = this.type;
        get("machine/cabinets",param).then((res) => {
            if(res.data.code==1) {
                this.cabinets = res.data.data.map(item => new CabinetStores(item));
            }
        });
    }
    @action.bound
    switchType(type) {
        this.type = type;
    }
    @action.bound
    getData() {
        this.changeRequestState(2);
        this.machineLibrarys = [];
        get("machine/machineroom").then((res) => {
            if(res.data.code==1) {
                this.comprooms = res.data.data.map(item => new ComproomStores(item));
            }
        });
        get("machine/showmachine",{
            business_type: this.type
        }).then(res => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.machineLibrarys = res.data.data.map(item => new MachineLibraryStores(item));
            }
        });
    }
}
export default MachineLibrarysStores;
