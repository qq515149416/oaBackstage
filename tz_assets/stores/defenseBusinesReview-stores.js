import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";

class DefenseBusinesReviewStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class DefenseBusinesReviewsStores extends ActionBoundStores {
    @observable defenseBusinesReviews = [

    ];
    @action.bound
    getData() {
        this.changeRequestState(2);
        this.defenseBusinesReviews = [];
        get("defenseip/order/showUpExamineDefenseIp").then(res => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.defenseBusinesReviews = res.data.data.map(item => new DefenseBusinesReviewStores(item));
            }
        });
    }
}

export default DefenseBusinesReviewsStores;
