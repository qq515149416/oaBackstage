import { observable, action, extendObservable} from "mobx";
import { get } from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');


class StatisticalOverviewStores extends ActionBoundStores {
    @observable statisticalOverview = {

    };
}
export default StatisticalOverviewStores;
