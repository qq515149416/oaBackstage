import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import DealWith from "../component/icon/dealWith.jsx";
import { post } from "../tool/http.js";
import ClearMachineLibrary from "../component/dialog/clearMachineLibrary.jsx";

const columnData = [
    { id: 'client_name', numeric: true, disablePadding: false, label: '客户' },
    { id: 'sales_name', numeric: true, disablePadding: false, label: '业务员' },
    { id: 'machine_number', numeric: true, disablePadding: false, label: '机器编号' },
    { id: 'resource_type', numeric: true, disablePadding: false, label: '资源类型' },
    { id: 'cabinets', numeric: true, disablePadding: false, label: '机柜' },
    { id: 'removestatus', numeric: true, disablePadding: false, label: '下架状态' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作',  extend: true, extendData: [
        {id: "business_number", label: "业务号", type: "text"},
        {id: "business_note", label: "业务备注", type: "text"},
        {id: "remove_reason", label: "下架原因", type: "text"},
        {id: "resource_detail", label: "资源详情", type: "subordinate", subordinate: [
            {id: "machine_num", label: "机器编号", type: "text"},
            {id: "cpu", label: "CPU", type: "text"},
            {id: "memory", label: "内存", type: "text"},
            {id: "harddisk", label: "硬盘", type: "text"},
            {id: "bandwidth", label: "带宽", type: "text"},
            {id: "protect", label: "防御", type: "text"},
            {id: "loginname", label: "账号", type: "text"},
            {id: "loginpass", label: "密码", type: "text"},
            {id: "machine_type", label: "机器型号", type: "text"},
            {id: "machine_note", label: "机器备注", type: "text"},
            {id: "cabinet_id", label: "机柜编号", type: "text"}
          ]}
    ],extendConfirm: {
        rule: {
            term: "remove_status",
            execute: 2,
            type: "equal"
        },
        title: "下架操作",
        content: "是否要对业务进行下架操作",
        icon: <DealWith />,
        ok: (data) => {
            return new Promise((resolve,reject) => {
                post("under/do_under",{
                    business_number: data.business_number,
                    type: 1
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
    },extendElement: (data,update) => {
        if(data.remove_status==3) {
            return <ClearMachineLibrary update={update} postUrl="under/do_under" {...data} />
        }

    }
 }
];

const columnData2 = [
    { id: 'customer_name', numeric: true, disablePadding: false, label: '客户' },
    { id: 'business_name', numeric: true, disablePadding: false, label: '业务员' },
    { id: 'resource_detail', numeric: true, disablePadding: false, label: '资源' },
    { id: 'resourcetype', numeric: true, disablePadding: false, label: '资源类型' },
    { id: 'cabinetid', numeric: true, disablePadding: false, label: '机柜' },
    { id: 'removestatus', numeric: true, disablePadding: false, label: '下架状态' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作',  extend: true, extendData: [
        {id: "parent_businessnum", label: "业务号", type: "text"},
        {id: "resource_businessnum", label: "资源号", type: "text"},
        {id: "remove_reason", label: "下架原因", type: "text"},
        {id: "resource_num", label: "资源值", type: "text"},

    ],extendConfirm: {
        title: "下架操作",
        content: "是否要对资源进行下架操作",
        icon: <DealWith />,
        ok: (data) => {
            return new Promise((resolve,reject) => {
                post("under/do_under",{
                    business_id: data.id,
                    type: 2
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
    } }
]

const inputType = [
];

@inject("dismissalReviewsStores")
@observer
class DisposalList extends React.Component {
    componentDidMount() {
        this.props.dismissalReviewsStores.getData("disposal");
    }
    updata() {
        this.props.dismissalReviewsStores.getData("disposal");
    }
    render() {
        return [
            <ListTableComponent
                title="业务下架处理"
                operattext="业务下架"
                inputType={inputType}
                headTitlesData={columnData}
                data={this.props.dismissalReviewsStores.dismissalReviews.business}
                currentStores={this.props.dismissalReviewsStores}
                otherConfig={{rowsPerPage: 5}}
                updata={this.updata.bind(this)}
            />,
            <ListTableComponent
                title="资源下架处理"
                operattext="资源下架"
                inputType={inputType}
                headTitlesData={columnData2}
                data={this.props.dismissalReviewsStores.dismissalReviews.orders}
                currentStores={this.props.dismissalReviewsStores}
                otherConfig={{rowsPerPage: 5}}
                updata={this.updata.bind(this)}
            />
        ];
    }
}
export default DisposalList;
