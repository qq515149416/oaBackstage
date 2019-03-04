import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";

class DefenseipReviewStores {
    constructor(data) {
        extendObservable(this,data);
    }
}

class DefenseipReviewsStores extends ActionBoundStores {
    @observable defenseipReviews = [

    ];
    @action.bound
    getData() {
        this.changeRequestState(2);
        this.defenseipReviews = [];
        get("defenseip/remove/showExamine").then(res => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.defenseipReviews = res.data.data.map(item => new DefenseipReviewStores(item));
            }
        });
    }
}

export default DefenseipReviewsStores;
