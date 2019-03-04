import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class FinanceStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class FinancesStores extends ActionBoundStores {
    @observable finances = [

    ];
    type = "";
    @action.bound
    getData(param={}) {
        this.changeRequestState(2);
        this.finances = [];
        post("business/finance",param).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.finances = res.data.data.map(item => new FinanceStores(item));
            }
        });
    }
}
export default FinancesStores;
