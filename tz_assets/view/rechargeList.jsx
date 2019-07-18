import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
const qs = require('qs');

const columnData = [
    { id: 'customer_name', numeric: true, disablePadding: false, label: '客户' },
    { id: 'salesman_name', numeric: true, disablePadding: false, label: '充值人' },
    { id: 'money_before', numeric: true, disablePadding: false, label: '充值前余额' },
    { id: 'money_after', numeric: true, disablePadding: false, label: '充值后余额' },
    { id: 'recharge_amount', numeric: true, disablePadding: false, label: '充值金额' },
    { id: 'recharge_way', numeric: true, disablePadding: false, label: '充值方式' },
    { id: 'bank', numeric: true, disablePadding: false, label: '到账银行' },
    { id: 'tax', numeric: true, disablePadding: false, label: '税额' },
    { id: 'timestamp', numeric: true, disablePadding: false, label: '充值时间' },
    { id: 'operat', numeric: true, disablePadding: false, extend: true, extendData: [
        {id: "customer_name", label: "客户名称", type: "text"},
        {id: "money_before", label: "充值前余额" ,type: "text"},
        {id: "money_after", label: "充值后余额" ,type: "text"},
        {id: "recharge_amount", label: "充值金额" ,type: "text"},
        {id: "recharge_way", label: "充值方式" ,type: "text"},
        // {id: "salesman_name", label: "充值人" ,type: "text"},
        {id: "trade_no", label: "充值单号" ,type: "text"},
        {id: "timestamp", label: "充值时间" ,type: "text"},
        {id: "voucher", label: "凭据" ,type: "text"},
        {id: "remarks", label: "备注" ,type: "text"}
    ], label: '操作' }
];
const inputType = [
];
const filterType = [
    {
        field: "voucher",
        label: "充值渠道",
        options: [
            {
            view: "腾正公帐(建设银行)"
            },
            {
            view: "腾正公帐(工商银行)"
            },
            {
            view: "腾正公帐(招商银行)"
            },
            {
            view: "腾正公帐(农业银行)"
            },
            {
            view: "正易公帐(中国银行)"
            },
            {
            view: "支付宝"
            },
            {
            view: "公帐支付宝"
            },
            {
            view: "财付通"
            },
            {
            view: "微信支付"
            },
            {
            view: "新支付宝"
            }
        ],
        type: "select"
    },
    {
        field: "timestamp",
        label: "充值时间",
        type: "date"
    }
];
@inject("rechargesStores")
@observer
class RechargeList extends React.Component {
    componentDidMount() {
        if(location.search.indexOf("?id") > -1) {
            this.props.rechargesStores.getData({
                customer_id: qs.parse(location.search.substr(1)).id
            });
        } else {
            this.props.rechargesStores.getData();
        }
    }
    //   过滤充值记录
  filterData = (param) => {
    const {rechargesStores} = this.props;
    rechargesStores.filterData(param);
  }
    render() {
        return (
            <ListTableComponent
            title={`充值记录&nbsp;&nbsp;&nbsp;&nbsp;总共税额金额：<span style="color: #d00;">${this.props.rechargesStores.recharge.reduce((a,b) => a + parseFloat(b.tax),0)}元</span>&nbsp;&nbsp;&nbsp;&nbsp;总共充值金额：<span style="color: #d00;">${this.props.rechargesStores.recharge.reduce((a,b) => a + parseFloat(b.recharge_amount),0)}元</span>`}
            operattext="充值"
            inputType={inputType}
            filterType={filterType}
            headTitlesData={columnData}
            data={this.props.rechargesStores.recharge}
            currentStores={this.props.rechargesStores}
            filterData={this.filterData.bind(this)}
          />
        );
      }
}
export default RechargeList;
