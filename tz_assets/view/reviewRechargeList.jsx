import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import TabComponent from "../component/tabComponent.jsx";
import ManualRechargeEdit from "../component/dialog/manualRechargeEdit.jsx";
import { post } from "../tool/http.js";
import { inject,observer } from "mobx-react";
import Approval from "../component/icon/approval.jsx";
const qs = require('qs');

const styles = theme => ({
    listTableComponent: {
        marginTop: 0,
        borderRadius: "0 0 4px 4px",
        boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    },
    listFilterComponent: {
        marginTop: 0,
        borderRadius: "0",
        boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    }
});

const operat = {};

if(location.search.indexOf("?type=check") == -1) {
    operat["extendElement"] = (data,update) => {
        return <ManualRechargeEdit postUrl="business/auditRecharge" update={update} nameParam="trade_no" {...data} />;
    };
    // operat["extendConfirm"] = {
    //     rule: {
    //         term: "audit_status",
    //         execute: 0,
    //         type: "equal"
    //     },
    //     title: "审核操作",
    //     content: "是否要审核这条充值记录",
    //     icon: <Approval />,
    //     select: true,
    //     selectOptions: [
    //         {
    //             text: "通过",
    //             value: 1,
    //             default: true
    //         },
    //         {
    //             text: "不通过",
    //             value: -1
    //         }
    //     ],
    //     ok: (data,param) => {
    //         return new Promise((resolve,reject) => {
    //             post("business/auditRecharge",{
    //                 audit_status: param,
    //                 trade_id: data.id
    //             }).then((res) => {
    //                 if(res.data.code==1) {
    //                     alert(res.data.msg);
    //                     resolve(res.data);
    //                 } else {
    //                     alert(res.data.msg);
    //                     resolve(res.data);
    //                 }
    //             }).catch(reject);
    //         });
    //     }
    // }
}

const columnData = [
    { id: 'customer_name', numeric: true, disablePadding: false, label: '客户账号' },
    { id: 'recharge_amount', numeric: true, disablePadding: false, label: '充值金额' },
    { id: 'tax', numeric: true, disablePadding: false, label: '税额' },
    { id: 'recharge_way', numeric: true, disablePadding: false, label: '付款方式' },
    { id: 'recharger', numeric: true, disablePadding: false, label: '操作人员' },
    { id: 'audit_status_name', numeric: true, disablePadding: false, label: '审核结果' },
    { id: 'pay_at', numeric: true, disablePadding: false, label: '到账时间' },
    { id: 'operat', numeric: true, disablePadding: false, extend: true, extendData: [
        {id: "customer_name", label: "客户账号", type: "text"},
        {id: "recharge_amount", label: "充值金额" ,type: "text"},
        {id: "recharge_way", label: "付款方式" ,type: "text"},
        {id: "recharger", label: "操作人员" ,type: "text"},
        {id: "audit_status", label: "审核结果" ,type: "text"},
        {id: "created_at", label: "创建时间" ,type: "text"},
        {id: "trade_no", label: "充值单号" ,type: "text"},
        {id: "remarks", label: "备注" ,type: "text"}
    ], ...operat, label: '操作' }
];

const inputType = [
];

const filterType = [
    {
        field: "recharge_way",
        label: "充值方式",
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
        field: "pay_at",
        label: "到账时间",
        type: "date"
    }
];

@inject("reviewRechargesStores")
@observer
class ReviewRechargeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }
    componentDidMount() {
        this.props.reviewRechargesStores.getData({
            audit_status: 0
        });
    }
    handleChange = (value) => {
        this.props.reviewRechargesStores.getData({
            audit_status: value
        });
        this.setState({ value });
    }
    updata() {
        this.props.reviewRechargesStores.getData({
            audit_status: this.state.value,
        });
    }
      //   过滤审核记录
  filterData = (param) => {
    const {reviewRechargesStores} = this.props;
    reviewRechargesStores.filterData(param);
  }
    render() {
        const { classes } = this.props;
        return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
                {
                    label: "待审核",
                    value: 0
                },
                {
                    label: "审核通过",
                    value: 1
                },
                {
                    label: "审核不通过",
                    value: -1
                }
            ]}>
                <ListTableComponent
                className={classes.listTableComponent}
                listFilterComponentClassName={classes.listFilterComponent}
            title="充值审核管理"
            operattext="充值审核"
            inputType={inputType}
            filterType={filterType}
            headTitlesData={columnData}
            data={this.props.reviewRechargesStores.reviewRecharges}
            currentStores={this.props.reviewRechargesStores}
            updata={this.updata.bind(this)}
            filterData={this.filterData.bind(this)}
          />
            </TabComponent>
        );
      }
}
ReviewRechargeList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ReviewRechargeList);
