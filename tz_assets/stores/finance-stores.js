import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class FinanceStores {
    constructor(data) {
        data.id = data.flow_id;
        extendObservable(this,data);
    }
}
class FinancesStores extends ActionBoundStores {
    @observable finances = [

    ];
    @observable finance_info = {

    };
    type = "";
    @action.bound
    getData(param={}) {
        this.changeRequestState(2);
        this.finances = [];
        get("business/finance",param).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.finances = res.data.data.info.map(item => new FinanceStores(item));
                this.finance_info = Object.keys(res.data.data).reduce((item,current) => {
                    if(current!=="info") {
                        item[current] = res.data.data[current];
                    }
                    return item;
                },{});
            }
        });
    }
}
export default FinancesStores;
