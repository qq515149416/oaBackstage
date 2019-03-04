import { observable, action} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class EmployeeManagementStores {
    @observable id = 1;
    @observable name = "";
    @observable role = "";
    @observable username = "";
    @observable created_at = "";
    @observable updated_at = "";
    constructor({id, name, role, username, created_at = dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss"), updated_at = dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss")}) {
        Object.assign(this,{
            id,
            name,
            role,
            username,
            created_at,
            updated_at
        });
    }
}
class EmployeeManagementsStores extends ActionBoundStores {
    @observable employeeManagements = [

    ];
    filterData(param) {
        this.filterStoreData("employeeManagements","select",param);
    }
    @action.bound
    getData() {
        this.changeRequestState(2);
        get("hr/showaccount").then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.employeeManagements = res.data.data.map(item => new EmployeeManagementStores(item));
            }
        });
    }
}
export default EmployeeManagementsStores;
