import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
// import Paper from '@material-ui/core/Paper';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
import extendElementsComponent from "../tool/extendElementsComponent";
import Disposal from "../component/dialog/disposal.jsx";
import RenewalFee from "../component/dialog/renewalFee.jsx";
import SelectExpansion from "../component/dialog/selectExpansion.jsx";
import GetResource from "../component/dialog/GetResource.jsx";
import TabComponent from "../component/tabComponent.jsx";
import { post,get } from "../tool/http.js";
import { routerConfig } from "../config/common/config.js";
import OverlayBusinessSelect from "../component/dialog/overlayBusinessSelect.jsx";
const qs = require('qs');
const styles = theme => ({
    listTableComponent: {
        marginTop: 0,
        borderRadius: "0 0 4px 4px",
        boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    },
    tabAppBar: {
        backgroundColor: "transparent",
        boxShadow: "none"
    }
});
const columnData = [
    { id: 'order_sn', numeric: true, disablePadding: true, label: '订单号' },
    { id: 'customer_name', numeric: true, disablePadding: true, label: '客户' },
    // { id: 'business_name', numeric: true, disablePadding: true, label: '业务员' },
    { id: 'resourcetype', numeric: true, disablePadding: true, label: '资源类型' },
    { id: 'resource', numeric: true, disablePadding: true, label: '资源' },
    // { id: 'order_type', numeric: true, disablePadding: true, label: '订单类型' },
    { id: 'price', numeric: true, disablePadding: true, label: '单价' },
    { id: 'duration', numeric: true, disablePadding: true, label: '累计时长' },
    { id: 'remove_status', numeric: true, disablePadding: true, label: '下架状态' },
    { id: 'order_status', numeric: true, disablePadding: true, label: '订单状态' },
    { id: 'end_time', numeric: true, disablePadding: true, label: '到期时间' },
    { id: 'operat', numeric: true, disablePadding: false, extend: true, extendData: [
        {id: "business_sn", label: "业务号", type: "text"},
        {id: "business_name", label: "业务员", type: "text"},
        {id: "before_money", label: "支付前余额", type: "text"},
        {id: "after_money", label: "支付后余额" ,type: "text"},
        {id: "machine_sn", label: "资源编号" ,type: "text"},
        {id: "resource", label: "资源" ,type: "text"},
        {id: "serial_number", label: "支付流水号" ,type: "text"},
        {id: "pay_time", label: "支付时间" ,type: "text"},
        // {id: "order_status", label: "订单状态" ,type: "text"},
        {id: "order_note", label: "订单备注" ,type: "text"},
        {id: "created_at", label: "创建时间" ,type: "text"}
    ],extendElement: (data) => {
        let Element = extendElementsComponent([
            RenewalFee,
            Disposal
          ]);

        if(data.order_status=="已支付") {
            if(data.type > 3) {
                return [
                    <Element {...data} disposal_type={2} postUrl="business/renewresource" nameParam="order_sn" type="订单" />,
                    <GetResource {...data} postUrl="business/change" nameParam="order_sn" type="更换" />,
                    data.type === 4 ? <OverlayBusinessSelect {...data} postUrl="overlay/useOverlayToIDC" nameParam="order_sn" type="选择叠加包" /> : null
                ];
            } else {
                return [
                    <GetResource {...data} postUrl="business/change" nameParam="order_sn" type="更换" />,
                    data.type < 3 ? <OverlayBusinessSelect {...data} postUrl="overlay/useOverlayToIDC" nameParam="order_sn" type="选择叠加包" /> : null
                ];
            }
        }else {
            if(data.type > 3) {
                return <Disposal {...data} disposal_type={2} />;
            } else {
                return null;
            }
        }
    },extendUrl: [
        {
            title: "更换记录",
            link: routerConfig.baseUrl+"/resourceHistory",
            param: ["id"]
        }
    ], label: '操作' }
];
const inputType = [
    {
        field: "resource_type",
        label: "资源类型",
        type: "switch",
        radioData: [
            {
                checked: true,
                value: 4,
                label: "IP"
            },
            {
                checked: false,
                value: 5,
                label: "CPU"
            },
            {
                checked: false,
                value: 6,
                label: "硬盘"
            },
            {
                checked: false,
                value: 7,
                label: "内存"
            },
            {
                checked: false,
                value: 8,
                label: "带宽"
            },
            {
                checked: false,
                value: 9,
                label: "防御"
            }
        ]
    },
    {
        field: "resource",
        label: "资源",
        type: "component",
        defaultData: [],
        Component: SelectExpansion,
        param: {
            buttonName: "选择资源"
        },
        rule: {
            term: "resource_type",
            execute: [
              {
                index: 4,
                value: "ip_resource",
                default: true
              },
              {
                index: 5,
                value: "cpu_resource"
              },
              {
                index: 6,
                value: "hardDisk_resource"
              },
              {
                index: 7,
                value: "ram_resource"
              },
              {
                index: 8,
                value: "bandwidth"
              },
              {
                index: 9,
                value: "defense"
              }
            ],
            type: "component"
          }
    },
    {
        field: "price",
        label: "单价",
        type: "text"
    },
    {
        field: "duration",
        label: "时长",
        type: "select",
        defaultData: [
            {
                value: 1,
                text: "一个月"
            },
            {
                value: 6,
                text: "六个月"
            },
            {
                value: 12,
                text: "一年"
            }
        ]
    }
];
@inject("ordersStores")
@observer
class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "all",
            title: "业务订单管理"
        };
    }
    componentDidMount() {
        let param = {};
        if(qs.parse(location.search.substr(1)).client_id) {
            param = {
                id: qs.parse(location.search.substr(1)).client_id
            }
        }
        get("business/admin_customer",param).then((res) => {
            if(res.data.code==1) {
                let customerInfo = res.data.data.find(item => item.id == qs.parse(location.search.substr(1)).client_id);
                this.setState({
                    title: `客户账号：${customerInfo.email}&nbsp;&nbsp;&nbsp;&nbsp;客户余额：${customerInfo.money}&nbsp;&nbsp;&nbsp;&nbsp;客户账号状态：${customerInfo.status}&nbsp;&nbsp;&nbsp;&nbsp;业务员：${customerInfo.clerk_name}`
                });
            }
        });
        this.props.ordersStores.getData({
            business_sn: qs.parse(location.search.substr(1)).business_number
        });
        this.getResourceData({
            resource_type: {
                value: 4
            }
        },"init");
        inputType[inputType.findIndex(item => item.field=="resource_type")].model = {
            getSubordinateData: this.getResourceData.bind(this)
        };
        inputType[inputType.findIndex(item => item.field=="resource")].model = {
            getSubordinateData: this.getResourceData.bind(this)
        };
    }
    delData = (selectedData,callbrak) => {
        const {ordersStores} = this.props;
        let delIng = selectedData.map(item => ordersStores.delData(item));
        callbrak(delIng);
    }
    addData = (param,callbrak) => {
        param.business_sn = qs.parse(location.search.substr(1)).business_number;
        param.customer_id = qs.parse(location.search.substr(1)).client_id;
        param.customer_name = qs.parse(location.search.substr(1)).client_name;
        if(param.resource_type>7) {
            param.machine_sn = qs.parse(location.search.substr(1)).machine_number;
            param.resource = param.resource;
        } else {
            param.machine_sn = param.resource.label;
            param.resource_id = param.resource.id;
            param.resource = param.resource.value;
        }
        this.props.ordersStores.addData(param).then((state) => {
            callbrak(state);
        });
      }
    getResourceData(param,type) {
        if(param.resource_type && param.resource_type.value > 4) {
            this.props.ordersStores.getResourceData({
                resource_type: param.resource_type.value,
                machineroom: qs.parse(location.search.substr(1)).machineroom_id
            });
        } else if(param.resource_type && param.company!=undefined) {
            this.props.ordersStores.getResourceData({
                resource_type: param.resource_type.value,
                company: param.company,
                machineroom: qs.parse(location.search.substr(1)).machineroom_id
            });
        } else {
            console.error("参数：",param,"有问题");
        }
    }
    handleChange = (value) => {
        if(value=="all") {
            this.props.ordersStores.getData({
                business_sn: qs.parse(location.search.substr(1)).business_number
            });
        } else {
            this.props.ordersStores.getData({
                business_sn: qs.parse(location.search.substr(1)).business_number,
                resource_type: value
            });
        }
        this.props.ordersStores.type = value;
        this.setState({ value });
    }
    render() {
        const {classes} = this.props;
        const { title } = this.state;
        inputType[inputType.findIndex(item => item.field=="resource")].defaultData = this.props.ordersStores.resource.map(item => {
            return {
              value: item,
              text: `编号：${item.label} | 参数：${item.value} | 机房：${item.machineroom}`
            }
        });
        //TabComponent
        /*
        <Paper square>
                <AppBar className={classes.tabAppBar} position="static" color="default">
                    <Tabs
                    value={this.state.value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                    scrollable
                    scrollButtons="auto"
                    >
                    <Tab label="全部" value={"all"} />
                    <Tab label="租用主机" value={1} />
                    <Tab label="托管主机" value={2} />
                    <Tab label="租用机柜" value={3} />
                    <Tab label="IP" value={4} />
                    <Tab label="CPU" value={5} />
                    <Tab label="硬盘" value={6} />
                    <Tab label="内存" value={7} />
                    <Tab label="带宽" value={8} />
                    <Tab label="防护" value={9} />
                    </Tabs>
                </AppBar>
            </Paper>

        */
        return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
                {
                    label: "全部",
                    value: "all"
                },
                {
                    label: "租用主机",
                    value: 1
                },
                {
                    label: "托管主机",
                    value: 2
                },
                {
                    label: "租用机柜",
                    value: 3
                },
                {
                    label: "IP",
                    value: 4
                },
                {
                    label: "CPU",
                    value: 5
                },
                {
                    label: "硬盘",
                    value: 6
                },
                {
                    label: "内存",
                    value: 7
                },
                {
                    label: "带宽",
                    value: 8
                },
                {
                    label: "防护",
                    value: 9
                }
            ]}>
                <ListTableComponent
                    className={classes.listTableComponent}
                    title={title}
                    operattext="业务订单操作"
                    inputType={inputType}
                    headTitlesData={columnData}
                    data={this.props.ordersStores.orders}
                    currentStores={this.props.ordersStores}
                    addData={this.addData.bind(this)}
                    delData={this.delData.bind(this)}
                />
            </TabComponent>
        );
      }
}
OrderList.propTypes = {
    classes: PropTypes.object.isRequired,
};
const OrderListComponent = (props) => {
    return <OrderList {...props} />
}
export default withStyles(styles)(OrderListComponent);
