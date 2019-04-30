import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
// import ChangeStatus from "../component/dialog/changeStatus.jsx";
import Communication from "../component/dialog/communication.jsx";
import TabComponent from "../component/tabComponent.jsx";
import DealWith from "../component/icon/dealWith.jsx";
import DefenseipReviewList from "./defenseipReviewList.jsx";
import { inject,observer } from "mobx-react";
import { get, post } from "../tool/http.js";
import ChatDialog from "../component/dialog/chatDialog.jsx";
import ClearMachineLibrary from "../component/dialog/clearMachineLibrary.jsx";

const disposalStyles = theme => ({
    listTableComponent: {
        marginTop: 0,
        borderRadius: "0 0 4px 4px",
        boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    },
    tapComponent: {
        marginTop: 10,
    }
});
@inject("dismissalReviewsStores")
@observer
class DisposalList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1,
            title: "业务下架处理",
            operattext: "业务下架",
            operat: "business",
            columnData: [
                { id: 'client_name', numeric: true, disablePadding: false, label: '客户' },
                { id: 'sales_name', numeric: true, disablePadding: false, label: '业务员' },
                { id: 'machine_number', numeric: true, disablePadding: false, label: '机器编号' },
                { id: 'resource_type', numeric: true, disablePadding: false, label: '资源类型' },
                { id: 'removestatus', numeric: true, disablePadding: false, label: '下架状态' },
                { id: 'detail_json.machineroom_name', numeric: true, disablePadding: false, label: '机房' },
                { id: 'detail_json.cabinets', numeric: true, disablePadding: false, label: '机柜' },
                { id: 'detail_json.ip_detail', numeric: true, disablePadding: false, label: 'IP' },
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
            ]
        };
        this.inputType = [];
    }
    componentDidMount() {
        this.props.dismissalReviewsStores.getData("disposal");
    }
    updata() {
        this.props.dismissalReviewsStores.getData("disposal");
    }
    handleChange = (value) => {
        let title = "业务下架处理";
        let operattext = "业务下架";
        let operat = "business";
        let columnData = [
            { id: 'client_name', numeric: true, disablePadding: false, label: '客户' },
            { id: 'sales_name', numeric: true, disablePadding: false, label: '业务员' },
            { id: 'machine_number', numeric: true, disablePadding: false, label: '机器编号' },
            { id: 'resource_type', numeric: true, disablePadding: false, label: '资源类型' },
            { id: 'removestatus', numeric: true, disablePadding: false, label: '下架状态' },
            { id: 'detail_json.machineroom_name', numeric: true, disablePadding: false, label: '机房' },
            { id: 'detail_json.cabinets', numeric: true, disablePadding: false, label: '机柜' },
            { id: 'detail_json.ip_detail', numeric: true, disablePadding: false, label: 'IP' },
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
        if(value==2) {
            operat = "orders";
            title = "资源下架处理";
            operattext = "资源下架";
            columnData = [
                { id: 'customer_name', numeric: true, disablePadding: false, label: '客户' },
                { id: 'business_name', numeric: true, disablePadding: false, label: '业务员' },
                { id: 'resource', numeric: true, disablePadding: false, label: '资源' },
                { id: 'resourcetype', numeric: true, disablePadding: false, label: '资源类型' },
                { id: 'removestatus', numeric: true, disablePadding: false, label: '下架状态' },
                { id: 'cabinets', numeric: true, disablePadding: false, label: '机柜' },
                { id: 'ip', numeric: true, disablePadding: false, label: 'IP' },
                { id: 'operat', numeric: true, disablePadding: false, label: '操作',  extend: true, extendData: [
                    {id: "business_sn", label: "业务号", type: "text"},
                    {id: "order_sn", label: "订单号", type: "text"},
                    {id: "remove_reason", label: "下架原因", type: "text"},
                    {id: "machine_sn", label: "资源值", type: "text"},

                ],extendConfirm: {
                    title: "下架操作",
                    content: "是否要对资源进行下架操作",
                    icon: <DealWith />,
                    ok: (data) => {
                        return new Promise((resolve,reject) => {
                            post("under/do_under",{
                                order_sn: data.order_sn,
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
            ];
        }
        this.setState({ value,title,operattext,columnData,operat });
    }
    render() {
        const { classes } = this.props;
        return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
                {
                    label: "业务下架",
                    value: 1
                },
                {
                    label: "资源下架",
                    value: 2
                }
            ]}>
                <ListTableComponent
                    className={classes.listTableComponent}
                    title={this.state.title}
                    operattext={this.state.operattext}
                    inputType={this.inputType}
                    headTitlesData={this.state.columnData}
                    data={this.props.dismissalReviewsStores.dismissalReviews[this.state.operat]}
                    currentStores={this.props.dismissalReviewsStores}
                    otherConfig={{rowsPerPage: 5}}
                    updata={this.updata.bind(this)}
                    prohibitedPage={true}
                />
            </TabComponent>
        );
    }
}

const DisposalListWepper = withStyles(disposalStyles)(DisposalList);


@inject("workOrdersStores")
@observer
class WorkOrderList extends React.Component {
    static contextTypes = {
        socket: PropTypes.object
    }
    constructor(props) {
        super(props);
        this.columnData = [
            { id: 'work_order_number', numeric: true, disablePadding: true, label: '工单号' },
            { id: 'client_name', numeric: true, disablePadding: true, label: '客户' },
            { id: 'worktype', numeric: true, disablePadding: true, label: '工单类型' },
            { id: 'submitter_name', numeric: true, disablePadding: true, label: '提交人' },
            { id: 'submit', numeric: true, disablePadding: true, label: '提交方' },
            { id: 'workstatus', numeric: true, disablePadding: true, label: '状态' },
            { id: 'department', numeric: true, disablePadding: true, label: '处理部门' },
            { id: 'cabinet', numeric: true, disablePadding: true, label: '机柜' },
            { id: 'machineroom', numeric: true, disablePadding: true, label: '机房' },
            { id: 'ip', numeric: true, disablePadding: true, label: 'IP' },
            { id: 'machine_number', numeric: true, disablePadding: true, label: '机器编号' },
            { id: 'created_at', numeric: true, disablePadding: true, label: '发起时间' },
            { id: 'operat', numeric: true, disablePadding: false, extend: true, extendData: [
                {id: "business_num", label: "业务编号", type: "text"},
                {id: "sales_name", label: "业务员" ,type: "text"},
                {id: "work_order_content", label: "工单内容" ,type: "text"},
                {id: "complete_number", label: "完成人员工号" ,type: "text"},
                {id: "summary", label: "总结" ,type: "text"},
                {id: "complete_time", label: "完成时间" ,type: "text"},
                {id: "business_type", label: "业务类型" ,type: "text"},
                {id: "machine_number", label: "机器编号" ,type: "text"},
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
            ],extendElement: (data) => {

                return <Communication {...data} />;
                // if(data.work_order_status < 2) {

                // } else {
                //     return <ChangeStatus {...data} postUrl="workorder/edit" nameParam="work_order_number" />;
                // }
            }, label: '操作' }
        ];
        this.inputType = [];
    }
    componentDidMount() {
        const { socket } = this.context;
        get("show/pwdDepartment").then(res => {
            if(res.data.code == 1) {
                // socket.emit("connect","start"); res.data.data.id
                socket.emit("login",{
                    "depart": res.data.data.id
                });
                socket.on("new_work_order",content=>{
                    // if(content.work_order_status=="0") {
                    //     if(!document.getElementById("orderListAudio")) {
                    //         let audio = new Audio();
                    //         audio.src = require("../resource/export.mp3");
                    //         audio.setAttribute("id","orderListAudio");
                    //         audio.loop = false;
                    //         audio.autoplay = true;
                    //         document.body.appendChild(audio);
                    //     }
                    //     if(document.getElementById("orderListAudio").ended) {
                    //         document.getElementById("orderListAudio").play();
                    //     }
                    // }
                    console.log(content);
                    this.props.workOrdersStores.addData(content);
                });
            }
        });

        this.props.workOrdersStores.getData({
            work_order_status: this.props.type
        });
    }
    delData = (selectedData,callbrak) => {
        const {workOrdersStores} = this.props;
        let delIng = selectedData.map(item => workOrdersStores.delData(item));
        callbrak(delIng);
    }
    render() {
        console.log(this.props.workOrdersStores.workOrderObj);
        return (
            <ListTableComponent
                title={this.props.title}
                operattext="工单信息"
                inputType={this.inputType}
                headTitlesData={this.columnData}
                data={this.props.workOrdersStores.workOrderObj[this.props.type] || []}
                delData={this.delData.bind(this)}
                prohibitedPage={true}
                extendComponent={ChatDialog}
            />
        );
    }
}


class MachineProcessing extends React.Component {
    render() {
        return [
            <WorkOrderList
                title="待处理工单"
                type={0}
            />,
            <WorkOrderList
                title="处理中工单"
                type={1}
            />,
            <DisposalListWepper />,
            <DefenseipReviewList />,
        ];
    }
}
export default MachineProcessing;
