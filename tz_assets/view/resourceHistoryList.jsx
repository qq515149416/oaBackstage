import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import { post } from "../tool/http.js";
import Approval from "../component/icon/approval.jsx";
import DealWith from "../component/icon/dealWith.jsx";
import Reset from "../component/icon/reset.jsx";
const qs = require('qs');

const columnData = [
    { id: 'change_number', numeric: true, disablePadding: false, label: '更换编号' },
    { id: 'sales_name', numeric: true, disablePadding: false, label: '业务员' },
    { id: 'customer_name', numeric: true, disablePadding: false, label: '客户' },
    { id: 'before_resource_number', numeric: true, disablePadding: false, label: '更换前资源编号' },
    { id: 'before_type', numeric: true, disablePadding: false, label: '更换前资源类型' },
    { id: 'after_resource_number', numeric: true, disablePadding: false, label: '更换后资源编号' },
    { id: 'after_type', numeric: true, disablePadding: false, label: '更换后资源类型' },
    { id: 'status', numeric: true, disablePadding: false, label: '更换状态' },
    { id: 'operat', numeric: true, disablePadding: false, extend: true, extendConfirm: {
        rule: {
            term: "change_status",
            execute: 0,
            type: "equal"
        },
        icon: (data) => {
            if(data.change_status==0) {
                return <Approval />;
            } else if(data.change_status==1) {
                return <DealWith />;
            } else {
                return <Reset />;
            }
        },
        title: "审核更换资源",
        content: "是否要通过此资源更换审核？",
        input: true,
        select: true,
        selectOptions: [
            {
                text: "不通过",
                value: -1
            },
            {
                text: "通过",
                value: 1,
                default: true
            }
        ],
        ok: (data,param) => {
            return new Promise((resolve,reject) => {
                post("business/checkchange",{
                    change_status: param,
                    change_id: data.id,
                    check_note: data.note,
                    parent_business: data.parent_business
                }).then((res) => {
                    if(res.data.code==1) {
                        alert(res.data.msg);
                        resolve(res.data);
                    } else {
                        alert(res.data.msg);
                        resolve(res.data);
                    }
                }).catch(reject);
            });
        }
      }, extendData: [
        {id: "order_sn", label: "资源单号", type: "text"},
        {id: "business_sn", label: "业务号" ,type: "text"},
        {id: "before_machineroom_name", label: "更换前资源所属机房" ,type: "text"},
        {id: "before_cabinet_name", label: "更换前资源所属机柜" ,type: "text"},
        {id: "before_ip_detail", label: "更换前资源IP" ,type: "text"},
        {id: "after_machineroom_name", label: "更换后资源所属机房" ,type: "text"},
        {id: "after_cabinet_name", label: "更换后资源所属机柜" ,type: "text"},
        {id: "after_ip_detail", label: "更换后资源IP" ,type: "text"},
        {id: "change_time", label: "更换完成时间" ,type: "text"},
        {id: "change_reason", label: "更换原因" ,type: "text"},
        {id: "check_note", label: "审核备注" ,type: "text"},
        {id: "created_at", label: "更换时间" ,type: "text"}
    ], label: '操作' }
];
const inputType = [
];
@inject("resourceHistorysStores")
@observer
class ResourceHistoryList extends React.Component {
    componentDidMount() {
        if(location.search.indexOf("?id") > -1) {
            this.props.resourceHistorysStores.getData({
                order_id: qs.parse(location.search.substr(1)).id,
                ...qs.parse(location.search.substr(1))
            });
        } else {
            this.props.resourceHistorysStores.getData();
        }
    }
    //   更新数据
    updata() {
        if(location.search.indexOf("?id") > -1) {
            this.props.resourceHistorysStores.getData({
                order_id: qs.parse(location.search.substr(1)).id,
                ...qs.parse(location.search.substr(1))
            });
        } else {
            this.props.resourceHistorysStores.getData();
        }
    }
    render() {
        let data = this.props.resourceHistorysStores.resourceHistorys;
        if(this.props.type && this.props.type==="change") {
           delete columnData.find(item => item.id==="operat").extendConfirm.rule;
           delete columnData.find(item => item.id==="operat").extendConfirm.input;
           delete columnData.find(item => item.id==="operat").extendConfirm.select;
           delete columnData.find(item => item.id==="operat").extendConfirm.selectOptions;
           columnData.find(item => item.id==="operat").extendConfirm.title = "机房操作";
           columnData.find(item => item.id==="operat").extendConfirm.content = "是否要通过此资源更换操作";
           data = data.filter(item => (item.change_status > 0 && item.change_status < 3));
        }
        if(location.search.indexOf("?id") > -1) {
            delete columnData.find(item => item.id==="operat").extendConfirm;
        }
        return (
            <ListTableComponent
            title="更换资源记录"
            operattext="更换"
            inputType={inputType}
            headTitlesData={columnData}
            data={data}
            currentStores={this.props.resourceHistorysStores}
            updata={this.updata.bind(this)}
            {...this.props}
          />
        );
      }
}
export default ResourceHistoryList;
