import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import Approval from "../component/icon/approval.jsx";
// import Paper from '@material-ui/core/Paper';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
import CustomizeTableToolbar from "../component/listTable/customizeTableToolbar.jsx";
import TabComponent from "../component/tabComponent.jsx";
import { post } from "../tool/http.js";

const styles = theme => ({
    listTableComponent: {
        marginTop: 0,
        borderRadius: "0 0 4px 4px",
        boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    }
});
// const columnData = [
//     { id: 'customer_name', numeric: true, disablePadding: false, label: '客户' },
//     { id: 'business_name', numeric: true, disablePadding: false, label: '业务员' },
//     { id: 'resource_type', numeric: true, disablePadding: false, label: '资源类型' },
//     { id: 'order_type', numeric: true, disablePadding: false, label: '订单类型' },
//     // { id: 'pay_type', numeric: true, disablePadding: false, label: '支付方式' },
//     { id: 'payable_money', numeric: true, disablePadding: false, label: '应付金额' },
//     { id: 'pay_time', numeric: true, disablePadding: false, label: '支付时间' },
//     { id: 'order_status', numeric: true, disablePadding: false, label: '订单状态' },
//     { id: 'operat', numeric: true, disablePadding: false, extend: true, extendData: [
//         {id: "order_sn", label: "订单号", type: "text"},
//         {id: "before_money", label: "支付前余额" ,type: "text"},
//         {id: "after_money", label: "支付后余额" ,type: "text"},
//         {id: "resource", label: "资源" ,type: "text"},
//         {id: "price", label: "单价" ,type: "text"},
//         {id: "duration", label: "时长" ,type: "text"},
//         {id: "payable_money", label: "应付金额" ,type: "text"},
//         {id: "end_time", label: "到期时间" ,type: "text"},
//         {id: "serial_number", label: "支付流水号" ,type: "text"},
//         {id: "order_note", label: "订单备注" ,type: "text"},
//     ],label: '操作'
//     }
// ];

const columnData = [
    { id: 'customer_email', numeric: true, disablePadding: false, label: '客户' },
    { id: 'business_name', numeric: true, disablePadding: false, label: '业务员' },
    { id: 'serial_number', numeric: true, disablePadding: false, label: '流水号' },
    { id: 'payable_money', numeric: true, disablePadding: false, label: '应付金额' },
    { id: 'type', numeric: true, disablePadding: false, label: '类型' },
    { id: 'actual_payment', numeric: true, disablePadding: false, label: '实际金额' },
    { id: 'preferential_amount', numeric: true, disablePadding: false, label: '优惠金额' },
    { id: 'pay_time', numeric: true, disablePadding: false, label: '支付时间' },
    { id: 'operat', numeric: true, disablePadding: false, extend: true, extendData: [
        {id: "business_number", label: "业务号" ,type: "text"},
        {id: "before_money", label: "支付前余额", type: "text"},
        {id: "after_money", label: "支付后余额" ,type: "text"},
        {id: "created_at", label: "创建时间" ,type: "text"},
        {id: "order_arr", label: "订单详情" ,type: "table",tableData: [
            {
                id: "business_sn",
                label: "业务号",
                type: "text"
            },
            {
                id: "order_sn",
                label: "订单号",
                type: "text"
            },
            {
                id: "order_type",
                label: "新购/续费",
                type: "text"
            },
            {
                id: "payable_money",
                label: "应付金额",
                type: "text"
            },
            {
                id: "resource_type",
                label: "资源类型",
                type: "text"
            }
        ]}
    ],extendConfirm: {
        icon: <Approval />,
        title: "复核操作",
        content: "是否要对此流水提出复核申请？",
        input: true,
        ok: (data) => {
            return new Promise((resolve,reject) => {
                post("business/ordersReview",{
                    flow_id: data.flow_id,
                    reason: data.note
                }).then((res) => {
                    alert(res.data.msg);
                    if(res.data.code==1) {
                        resolve(res.data);
                    } else {
                        resolve(res.data);
                    }
                }).catch(reject);
            });
        }
    },label: '操作'
    }
];
const inputType = [
];
@inject("financesStores")
@observer
class FinanceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "all"
        };
    }
    componentDidMount() {
        this.props.financesStores.getData();
    }
    handleChange = (value) => {
        if(value=="all") {
            this.props.financesStores.getData();
        } else {
            this.props.financesStores.getData({
                order_status: value
            });
        }
        this.props.financesStores.type = value;
        this.setState({ value });
    }
    render() {
        const {classes} = this.props;
        /*
            <Paper square>
                <Tabs
                value={this.state.value}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleChange}
                >
                <Tab className={classes.tab} label="全部" value={"all"} />
                <Tab className={classes.tab} label="待支付" value={0} />
                <Tab className={classes.tab} label="已支付" value={1} />
                <Tab className={classes.tab} label="财务确认" value={2} />
                <Tab className={classes.tab} label="订单完成" value={3} />
                <Tab className={classes.tab} label="取消" value={5} />
                <Tab className={classes.tab} label="申请退款" value={6} />
                <Tab className={classes.tab} label="退款完成" value={8} />
                </Tabs>
            </Paper>
        */
        return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
                {
                    label: "全部",
                    value: "all"
                },
                // {
                //     label: "待支付",
                //     value: 0
                // },
                // {
                //     label: "已支付",
                //     value: 1
                // },
                // {
                //     label: "财务确认",
                //     value: 2
                // },
                // {
                //     label: "订单完成",
                //     value: 3
                // },
                // {
                //     label: "取消",
                //     value: 5
                // },
                // {
                //     label: "申请退款",
                //     value: 6
                // },
                // {
                //     label: "退款完成",
                //     value: 8
                // }
            ]}>
                <ListTableComponent
            className={classes.listTableComponent}
            title="财务统计"
            operattext="财务管理"
            inputType={inputType}
            headTitlesData={columnData}
            data={this.props.financesStores.finances}
            currentStores={this.props.financesStores}
            customizeToolbar={(
                <div>
                    <CustomizeTableToolbar type="datetime-local" param={{order_status: this.state.value}} getData={this.props.financesStores.getData} />
                    <div style={{fontSize: "16px",marginTop: 20}}>
                    <span style={{marginRight: 20}}>当前查询应收金额：<span style={{color: 'red',fontSize: '18px'}}>{this.props.financesStores.finance_info.payable}</span></span>
                    <span style={{marginRight: 20}}>当前查询实收金额：<span style={{color: 'red',fontSize: '18px'}}>{this.props.financesStores.finance_info.paytrue}</span></span>
                    <span style={{marginRight: 20}}>当前查询优惠金额：<span style={{color: 'red',fontSize: '18px'}}>{this.props.financesStores.finance_info.discount}</span></span>
                    <span style={{marginRight: 20}}>当前查询总量：<span style={{color: 'red',fontSize: '18px'}}>{this.props.financesStores.finance_info.total}</span></span>
                    </div>
                </div>
            )}
          />
            </TabComponent>
        );
      }
}
FinanceList.propTypes = {
    classes: PropTypes.object.isRequired,
};
const FinanceListComponent = (props) => {
    return <FinanceList {...props} />
}
export default withStyles(styles)(FinanceListComponent);
