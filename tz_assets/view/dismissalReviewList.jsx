import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import UnderOperation from "../component/dialog/underOperation.jsx";


const columnData = [
    { id: 'client_name', numeric: true, disablePadding: false, label: '客户' },
    { id: 'sales_name', numeric: true, disablePadding: false, label: '业务员' },
    { id: 'machine_number', numeric: true, disablePadding: false, label: '机器编号' },
    { id: 'resource_type', numeric: true, disablePadding: false, label: '资源类型' },
    { id: 'ip', numeric: true, disablePadding: false, label: 'IP' },
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
    ], extendElement: (data,update) => {
        if(data.remove_status==1) {
            return <UnderOperation {...data} update={update} obtained_type={1} />;
        } else {
            return null;
        }

    } }
];

const columnData2 = [
    { id: 'customer_name', numeric: true, disablePadding: false, label: '客户' },
    { id: 'business_name', numeric: true, disablePadding: false, label: '业务员' },
    { id: 'resource_detail', numeric: true, disablePadding: false, label: '资源' },
    { id: 'resourcetype', numeric: true, disablePadding: false, label: '资源类型' },
    { id: 'ip', numeric: true, disablePadding: false, label: 'IP' },
    { id: 'cabinetid', numeric: true, disablePadding: false, label: '机柜' },
    { id: 'removestatus', numeric: true, disablePadding: false, label: '下架状态' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作',  extend: true, extendData: [
        {id: "parent_businessnum", label: "业务号", type: "text"},
        {id: "resource_businessnum", label: "资源号", type: "text"},
        {id: "remove_reason", label: "下架原因", type: "text"},
        {id: "resource_num", label: "资源值", type: "text"},

    ],extendElement: (data,update) => {
        if(data.remove_status==1) {
            return <UnderOperation {...data} update={update} obtained_type={2} />;
        } else {
            return null;
        }
    } }
]

const inputType = [
];

@inject("dismissalReviewsStores")
@observer
class DismissalReviewList extends React.Component {
    componentDidMount() {
        this.props.dismissalReviewsStores.getData();
    }
    updata() {
        this.props.dismissalReviewsStores.getData();
    }
      //   批量审核
    check_business_all(selectedData,callbrak) {
        const {dismissalReviewsStores} = this.props;
        let delIng = selectedData.map(item => {
            const otherParam = {};
            if(item.status==0) {
                otherParam["remove_status"] = 0;
                otherParam["remove_reason"] = item.note;
            }
            return dismissalReviewsStores.doUnder({
                business_number: dismissalReviewsStores.dismissalReviews.business.find(e => item.id == e.id).business_number,
                type: 1,
                parent_business: dismissalReviewsStores.dismissalReviews.business.find(e => item.id == e.id).parent_business,
                ...otherParam
            });
        });
        callbrak(delIng);
    }
    check_orders_all(selectedData,callbrak) {
        const {dismissalReviewsStores} = this.props;
        let delIng = selectedData.map(item => {
            const otherParam = {};
            if(item.status==0) {
                otherParam["remove_status"] = 0;
                otherParam["remove_reason"] = item.note;
            }
            return dismissalReviewsStores.doUnder({
                order_sn: dismissalReviewsStores.dismissalReviews.orders.find(e => item.id == e.id).order_sn,
                type: 2,
                ...otherParam
            });
        });
        callbrak(delIng);
    }
    render() {
        return [
            <ListTableComponent
                title="业务下架管理"
                operattext="业务下架"
                inputType={inputType}
                headTitlesData={columnData}
                data={this.props.dismissalReviewsStores.dismissalReviews.business.sort((a,b) => {
                    return a.remove_status - b.remove_status
                })}
                currentStores={this.props.dismissalReviewsStores}
                checkUnderAll={this.check_business_all.bind(this)}
                otherConfig={{rowsPerPage: 5}}
                updata={this.updata.bind(this)}
                nosort={true}
            />,
            <ListTableComponent
                title="资源下架管理"
                operattext="资源下架"
                inputType={inputType}
                headTitlesData={columnData2}
                checkUnderAll={this.check_orders_all.bind(this)}
                data={this.props.dismissalReviewsStores.dismissalReviews.orders.sort((a,b) => {
                    return a.remove_status - b.remove_status
                })}
                currentStores={this.props.dismissalReviewsStores}
                otherConfig={{rowsPerPage: 5}}
                updata={this.updata.bind(this)}
                nosort={true}
            />
        ];
    }
}
export default DismissalReviewList;
