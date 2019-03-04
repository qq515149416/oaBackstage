import { observable, action} from "mobx";
import {get,post} from "../tool/http.js";
import ActionBoundStores from "./common/action-bound-stores.js";
const dateFormat = require('dateformat');
class NewStores {
    @observable id =  1;
    @observable title =  "";
    @observable digest ="";
    @observable top_status = "";
    @observable home_status = "";
    @observable seoKeywords = "";
    @observable seoDescription = "";
    @observable seoTitle = "";
    @observable type_name = "";
    @observable content = "";
    @observable tid = 1;
    constructor({id, title, content, digest, top_status, home_status, seoKeywords, seoDescription, seoTitle,type_name,tid}) {
        Object.assign(this,{
            id,
            title,
            digest,
            content,
            top_status,
            home_status,
            seoKeywords,
            seoDescription,
            seoTitle,
            type_name,
            tid
        });
    }
}
class TypeStores {
    @observable tid =  1;
    @observable type_name =  "";
    constructor({tid,type_name}) {
        Object.assign(this,{
            tid,
            type_name
        });
    }
}
class NewsStores extends ActionBoundStores {
    @observable articles = [

    ];
    @observable types = [

    ];
    stateText(state,codes) {
        return codes[state];
    }
    delData(id) {
        return new Promise((resolve,reject) => {
            post("news/deleted",{
                delete_id: id
            }).then((res) => {
                if(res.data.code==1) {
                    this.delStoreData("articles",id);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    changeData(param) {
        return new Promise((resolve,reject) => {
            post("news/edit",param).then((res) => {
                if(res.data.code==1) {
                    this.changeStoreData("articles",NewStores,Object.assign(param,{
                        top_status: this.stateText(String(param.top_status),{
                            "0" : "不显示",
                            "1": "显示"
                        }),
                        home_status: this.stateText(String(param.home_status),{
                            "0" : "不显示",
                            "1": "显示"
                        }),
                        updated_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss"),
                        type_name: this.types.find(e => e.tid == param.tid).type_name
                    }));
                    resolve(true);
                }else {
                    alert(res.data.msg);
                    resolve(false);
                }
            }).catch(reject);
        });
    }
    addData(data) {
        return new Promise((resolve,reject) => {
            post("news/insert",data).then((res) => {
                if(res.data.code==1) {
                    this.addStoreData("articles",NewStores,Object.assign(data,{
                        id: res.data.data,
                        top_status: this.stateText(String(data.top_status),{
                            "0" : "不显示",
                            "1": "显示"
                        }),
                        home_status: this.stateText(String(data.home_status),{
                            "0" : "不显示",
                            "1": "显示"
                        }),
                        created_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss"),
                        updated_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss"),
                        type_name: this.types.find(e => e.tid == data.tid).type_name
                    }));
                    console.log(Object.assign(data,{
                        id: res.data.data,
                        top_status: this.stateText(String(data.top_status),{
                            "0" : "不显示",
                            "1": "显示"
                        }),
                        home_status: this.stateText(String(data.ip_status),{
                            "0" : "不显示",
                            "1": "显示"
                        }),
                        created_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss"),
                        updated_at: dateFormat(new Date(),"yyyy-mm-dd hh:MM:ss"),
                        type_name: this.types.find(e => e.tid == data.tid).type_name
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
        get("news/get_news_type").then((res) => {
            if(res.data.code==1) {
                this.types = res.data.data.map(item => new TypeStores(item));
            }
        });
        get("news/news_list").then((res) => {
            this.changeRequestState(res.data.code);
            if(res.data.code==1) {
                this.articles = res.data.data.map(item => new NewStores({
                    ...{
                        id: item.id,
                        title: item.title,
                        digest: item.digest,
                        top_status: item.top_status,
                        home_status: item.home_status,
                        seoKeywords: item.seoKeywords,
                        seoDescription: item.seoDescription,
                        seoTitle: item.seoTitle,
                        type_name: item.type_name,
                        content: item.content,
                        tid: item.tid
                    }
                }));
            }
        });
    }
}
export default NewsStores;
