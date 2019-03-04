import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import CustomizeTableToolbar from "../component/listTable/customizeTableToolbar.jsx";
import TabComponent from "../component/tabComponent.jsx";

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

const inputType = [
];
@inject("statisticalPerformancesStores")
@observer
class StatisticalPerformanceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1
        }
    }
    componentDidMount() {
        this.props.statisticalPerformancesStores.getData();
    }
    handleChange = (value) => {
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
        this.setState({ value });
    }

    render() {
        const {classes} = this.props;
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
