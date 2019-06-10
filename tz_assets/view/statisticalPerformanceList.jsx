import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import CustomizeTableToolbar from "../component/listTable/customizeTableToolbar.jsx";
import TabComponent from "../component/tabComponent.jsx";
import { routerConfig } from "../config/common/config.js";
const qs = require('qs');

const styles = theme => ({
    listTableComponent: {
        marginTop: 0,
        borderRadius: "0 0 4px 4px",
        boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    }
});
let title = "业绩统计";
let columnData = [
    { id: 'user_name', numeric: true, disablePadding: false, label: '业务员' },
    { id: 'new_achievement', numeric: true, disablePadding: false, label: '新购金额' },
    { id: 'old_achievement', numeric: true, disablePadding: false, label: '续费金额' },
    { id: 'new_arrears', numeric: true, disablePadding: false, label: '新购未付款' },
    { id: 'old_arrears', numeric: true, disablePadding: false, label: '续费未付款' },
    { id: 'total_money', numeric: true, disablePadding: false, label: '总消费金额' },
    { id: 'achievement', numeric: true, disablePadding: false, label: '有效业绩' },
    { id: 'operat', numeric: true, disablePadding: false, extend: true, extendData: [
        {id: "all_arrears", label: "历史欠款总额", type: "text"},
        {id: "preferential_amount", label: "优惠券扣除金额", type: "text"},
        {id: "this_arrears", label: "订单总额", type: "text"}
    ], label: '操作'}
];
if(location.search.indexOf("?type=recharge") > -1) {
    columnData = [
        { id: 'customer_name', numeric: true, disablePadding: false, label: '客户' },
        // { id: 'month', numeric: true, disablePadding: false, label: '月份' },
        { id: 'recharge_amount', numeric: true, disablePadding: false, label: '充值总额' },
        { id: 'artificial_amount', numeric: true, disablePadding: false, label: '手动充值金额' },
        { id: 'self_amount', numeric: true, disablePadding: false, label: '自助充值金额' },
        // { id: 'updated_at', numeric: true, disablePadding: false, label: '统计时间' }
    ];
    title = "充值统计";
}

if(location.search.indexOf("?type=all") > -1) {
    title = "业绩统计";
    columnData = [
        { id: 'name', numeric: true, disablePadding: false, label: '业务员' },
        { id: 'idc_count', numeric: true, disablePadding: false, label: 'IDC营业额' },
        { id: 'defense_count', numeric: true, disablePadding: false, label: '高防IP营业额' },
        { id: 'flow_count', numeric: true, disablePadding: false, label: '流量包营业额' },
        { id: 'cdn_count', numeric: true, disablePadding: false, label: 'CDN营业额' },
        { id: 'cloud_count', numeric: true, disablePadding: false, label: '云营业额' },
        { id: 'sum', numeric: true, disablePadding: false, label: '小计营业额' },
        { id: 'operat', numeric: true, disablePadding: false, extend: true, extendUrl: [
            {
                title: "查看全部",
                link: routerConfig.baseUrl+"/statisticalPerformance",
                param: ["business_id","begin","end"],
                rule: {
                    term: "type",
                    type: "equal",
                    execute: "oreder"
                }
            }
          ], label: '操作'}
    ];
}

if(location.search.indexOf("business_id=") > -1) {
    title = "业绩订单";
    columnData = [
        { id: 'order_sn', numeric: true, disablePadding: false, label: '单号' },
        { id: 'salesman', numeric: true, disablePadding: false, label: '业务员' },
        { id: 'customer', numeric: true, disablePadding: false, label: '客户' },
        { id: 'machine_sn', numeric: true, disablePadding: false, label: '资源编号' },
        { id: 'resource', numeric: true, disablePadding: false, label: '资源情况' },
        { id: 'type', numeric: true, disablePadding: false, label: '资源类型' },
        { id: 'price', numeric: true, disablePadding: false, label: '单价' },
        { id: 'duration', numeric: true, disablePadding: false, label: '累计时长' },
        { id: 'end_time', numeric: true, disablePadding: false, label: '到期时间' }
    ];
}

const inputType = [
];
@inject("statisticalPerformancesStores")
@observer
class StatisticalPerformanceList extends React.Component {
    constructor(props) {
        super(props);
        if(location.search.indexOf("business_id=") === -1) {
            this.state = {
                value: 1
            }
        } else {
            this.state = {
                value: "all"
            }
        }
    }
    componentDidMount() {
        if(location.search.indexOf("begin=") > -1&&location.search.indexOf("end=") > -1) {
            if(qs.parse(location.search.substr(1)).begin!="null"&&qs.parse(location.search.substr(1)).end!="null") {
                this.props.statisticalPerformancesStores.getData({
                    begin: qs.parse(location.search.substr(1)).begin,
                    end: qs.parse(location.search.substr(1)).end,
                    business_id: qs.parse(location.search.substr(1)).business_id
                });
            } else {
                this.props.statisticalPerformancesStores.getData({
                    business_id: qs.parse(location.search.substr(1)).business_id
                });
            }
        } else {
            this.props.statisticalPerformancesStores.getData();
        }
    }
    handleChange = (value) => {
        if(location.search.indexOf("business_id=") === -1) {
            this.props.statisticalPerformancesStores.business_type = value;
            this.props.statisticalPerformancesStores.statisticalPerformances = [];
            switch(value) {
                case 1:
                    columnData = [
                        { id: 'user_name', numeric: true, disablePadding: false, label: '业务员' },
                        { id: 'new_achievement', numeric: true, disablePadding: false, label: '新购金额' },
                        { id: 'old_achievement', numeric: true, disablePadding: false, label: '续费金额' },
                        { id: 'new_arrears', numeric: true, disablePadding: false, label: '新购未付款' },
                        { id: 'old_arrears', numeric: true, disablePadding: false, label: '续费未付款' },
                        { id: 'total_money', numeric: true, disablePadding: false, label: '总消费金额' },
                        { id: 'achievement', numeric: true, disablePadding: false, label: '有效业绩' },
                        { id: 'operat', numeric: true, disablePadding: false, extend: true, extendData: [
                            {id: "all_arrears", label: "历史订单总额", type: "text"},
                            {id: "preferential_amount", label: "优惠券扣除金额", type: "text"},
                            {id: "this_arrears", label: "订单总额", type: "text"}
                        ], label: '操作'}
                    ];
                break;
                case 2:
                    columnData = [
                        { id: 'user_name', numeric: true, disablePadding: false, label: '业务员' },
                        { id: 'new_achievement', numeric: true, disablePadding: false, label: '新购金额' },
                        { id: 'old_achievement', numeric: true, disablePadding: false, label: '续费金额' },
                        { id: 'total_money', numeric: true, disablePadding: false, label: '总消费金额' },
                        { id: 'preferential_amount', numeric: true, disablePadding: false, label: '优惠金额' }
                    ];
                break;
            }
        }
        this.setState({ value });
    }

    render() {
        const {classes} = this.props;
        /*
        1=>'租用主机',2=>'托管主机',3=>'租用机柜',4=>'IP',5=>'CPU',6=>'硬盘',7=>'内存',8=>'带宽',9=>'防护',10=>'cdn',11=>'高防
        */
        if(location.search.indexOf("business_id=") > -1) {
            return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
                {
                    label: "全部",
                    value: "all"
                },
                {
                    label: "IDC",
                    value: 9
                },
                {
                    label: "cdn",
                    value: 10
                },
                {
                    label: "高防",
                    value: 11
                },
                {
                    label: "叠加包",
                    value: 12
                }
            ]}>
                <ListTableComponent
                    title={title}
                    operattext="业绩管理"
                    inputType={inputType}
                    className={classes.listTableComponent}
                    headTitlesData={columnData}
                    data={this.props.statisticalPerformancesStores.statisticalPerformances.filter(item => {
                        console.log(this.state.value);
                        if(this.state.value == "all") {
                            return true;
                        }
                        if(this.state.value > 9) {
                            return item.resource_type == this.state.value;
                        } else {
                            return item.resource_type <= this.state.value;
                        }
                    })}
                    currentStores={this.props.statisticalPerformancesStores}
                />
            </TabComponent>
            );
        }
        if(location.search.indexOf("?type=all") > -1) {
            return (
                <ListTableComponent
                    title={title}
                    operattext="业绩管理"
                    inputType={inputType}
                    className={classes.listTableComponent}
                    headTitlesData={columnData}
                    data={this.props.statisticalPerformancesStores.statisticalPerformances}
                    currentStores={this.props.statisticalPerformancesStores}
                    nosort={true}
                    customizeToolbar={[
                        <CustomizeTableToolbar getData={this.props.statisticalPerformancesStores.getData} />,
                        <div>
                            <span style={{
                                fontSize: "16px"
                            }}>应收金额：{this.props.statisticalPerformancesStores.statisticalPerformanceInfo.payable_money}</span>
                            <span style={{
                                margin: "0 20px",
                                fontSize: "16px"
                            }}>优惠金额：{this.props.statisticalPerformancesStores.statisticalPerformanceInfo.preferential_amount}</span>
                            <span style={{
                                fontSize: "16px"
                            }}>实收金额：{this.props.statisticalPerformancesStores.statisticalPerformanceInfo.actual_payment}</span>
                        </div>
                    ]}
                />
            );
        }
        if(location.search.indexOf("?type=recharge") > -1) {
            return (
                <ListTableComponent
                    title={title}
                    operattext="业绩管理"
                    inputType={inputType}
                    className={classes.listTableComponent}
                    headTitlesData={columnData}
                    data={this.props.statisticalPerformancesStores.statisticalPerformances}
                    currentStores={this.props.statisticalPerformancesStores}
                    customizeToolbar={<CustomizeTableToolbar getData={this.props.statisticalPerformancesStores.getData} />}
                />
            );
        }
        return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
                {
                    label: "idc业务",
                    value: 1
                },
                {
                    label: "高防IP业务",
                    value: 2
                }
            ]}>
            <ListTableComponent
            title={title}
            operattext="业绩管理"
            inputType={inputType}
            className={classes.listTableComponent}
            headTitlesData={columnData}
            data={this.props.statisticalPerformancesStores.statisticalPerformances}
            currentStores={this.props.statisticalPerformancesStores}
            customizeToolbar={<CustomizeTableToolbar getData={this.props.statisticalPerformancesStores.getData} />}
          />
          </TabComponent>
        );
      }
}
StatisticalPerformanceList.propTypes = {
    classes: PropTypes.object.isRequired,
};
const StatisticalPerformanceListComponent = (props) => {
    return <StatisticalPerformanceList {...props} />
}
export default withStyles(styles)(StatisticalPerformanceListComponent);
