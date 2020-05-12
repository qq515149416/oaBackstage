import { observable, action, extendObservable} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";

class DismissalReviewStores {
    constructor(data) {
        extendObservable(this,data);
    }
}
class DismissalReviewsStores extends ActionBoundStores {
    @observable dismissalReviews = {
        business: [],
        orders: [],
    };
    doUnder(data) {
        return new Promise((resolve,reject) => {
            post("under/do_under",data).then((res) => {
                if(res.data.code==1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    @action.bound
    getData(type = "dismissalReview") {
        this.changeRequestState(2);
        this.dismissalReviews = {
            business: [],
            orders: [],
        };
        get("under/show_apply_under",{
            r: Math.random() * 1000
        }).then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                if(type=="dismissalReview") {
                    this.dismissalReviews.business = res.data.data.business.map(item => new DismissalReviewStores(Object.assign(item,{
                        detail_json: JSON.parse(item.resource_detail)
                    })));
                    console.log(this.dismissalReviews.business);
                    this.dismissalReviews.orders = res.data.data.orders.map(item => new DismissalReviewStores(item));
                } else {
                    this.dismissalReviews.business = res.data.data.business.filter(item => item.remove_status > 1).map(item => new DismissalReviewStores(Object.assign(item,{
                        detail_json: JSON.parse(item.resource_detail)
                    })));
                    console.log(this.dismissalReviews.business);
                    this.dismissalReviews.orders = res.data.data.orders.filter(item => item.remove_status > 1).map(item => new DismissalReviewStores(item));
                }

            }
        });
    }
}
export default DismissalReviewsStores;
