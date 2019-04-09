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



const inputType = [
];
@inject("customerStatisticssStores")
@observer
class CustomerStatisticsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "new",
            typeData: {
                new: {
                    columnData: [
                        { id: 'business_number', numeric: true, disablePadding: false, label: '业务号' },
                        { id: 'length', numeric: true, disablePadding: false, label: '累计时长' },
                        { id: 'money', numeric: true, disablePadding: false, label: '单价' },
                        { id: 'single_total', numeric: true, disablePadding: false, label: '预计营收' },
                        { id: 'client_name', numeric: true, disablePadding: false, label: '客户名称' },
                        { id: 'sales_name', numeric: true, disablePadding: false, label: '业务员' },
                        { id: 'ip', numeric: true, disablePadding: false, label: 'IP' },
                        { id: 'cabinet', numeric: true, disablePadding: false, label: '所在机柜' },
                        { id: 'machineroom', numeric: true, disablePadding: false, label: '所属机房' },
                        { id: 'type', numeric: true, disablePadding: false, label: '业务类型' },
                        { id: 'start_time', numeric: true, disablePadding: false, label: '开始时间' },
                        { id: 'endding_time', numeric: true, disablePadding: false, label: '结束时间' },
                        { id: 'status', numeric: true, disablePadding: false, label: '业务状态' }
                    ],
                    title: "新增业务"
                },
                obtained: {
                    columnData: [
                        { id: 'business_number', numeric: true, disablePadding: false, label: '业务号' },
                        // { id: 'length', numeric: true, disablePadding: false, label: '累计时长' },
                        { id: 'money', numeric: true, disablePadding: false, label: '月营收' },
                        { id: 'client_name', numeric: true, disablePadding: false, label: '客户名称' },
                        { id: 'sales_name', numeric: true, disablePadding: false, label: '业务员' },
                        { id: 'ip', numeric: true, disablePadding: false, label: 'IP' },
                        { id: 'cabinet', numeric: true, disablePadding: false, label: '所在机柜' },
                        { id: 'machineroom', numeric: true, disablePadding: false, label: '所属机房' },
                        { id: 'type', numeric: true, disablePadding: false, label: '业务类型' },
                        { id: 'start_time', numeric: true, disablePadding: false, label: '开始时间' },
                        { id: 'endding_time', numeric: true, disablePadding: false, label: '结束时间' },
                        { id: 'status', numeric: true, disablePadding: false, label: '业务状态' },
                        { id: 'remove', numeric: true, disablePadding: false, label: '下架状态' }
                    ],
                    title: "下架业务"
                },
                client: {
                    columnData: [
                        { id: 'name', numeric: true, disablePadding: false, label: '客户名称' },
                        { id: 'email', numeric: true, disablePadding: false, label: '客户邮箱' },
                        { id: 'money', numeric: true, disablePadding: false, label: '余额' },
                        { id: 'sales_name', numeric: true, disablePadding: false, label: '业务员' },
                        { id: 'nickname', numeric: true, disablePadding: false, label: '昵称' },
                        { id: 'msg_phone', numeric: true, disablePadding: false, label: '手机号码' },
                        { id: 'msg_qq', numeric: true, disablePadding: false, label: 'QQ' },
                        { id: 'user_status', numeric: true, disablePadding: false, label: '账户状态' },
                        { id: 'created_at', numeric: true, disablePadding: false, label: '注册时间' }
                    ],
                    title: "新增客户"
                }
            },

        }
    }
    componentDidMount() {
        this.props.customerStatisticssStores.getData();
    }
    handleChange = (value) => {
        this.props.customerStatisticssStores.type = value;
        this.props.customerStatisticssStores.customerStatisticss = [];
        this.props.customerStatisticssStores.detail = {};
        this.props.customerStatisticssStores.getData();
        this.setState({ value });
    }

    render() {
        const {classes} = this.props;
        return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
                {
                    label: "新增业务",
                    value: "new"
                },
                {
                    label: "下架业务",
                    value: "obtained"
                },
                {
                    label: "新增客户",
                    value: "client"
                }
            ]}>
            <ListTableComponent
            title={this.state.typeData[this.state.value]['title']}
            operattext="统计管理"
            inputType={inputType}
            className={classes.listTableComponent}
            headTitlesData={this.state.typeData[this.state.value]['columnData']}
            data={this.props.customerStatisticssStores.customerStatisticss}
            currentStores={this.props.customerStatisticssStores}
            customizeToolbar={(
                <div>
                    <CustomizeTableToolbar type="datetime-local" getData={this.props.customerStatisticssStores.getData} />
                    <div style={{fontSize: "16px",marginTop: 20}}>
                        {
                            this.state.value === "client" ? [
                                <span style={{marginRight: 20}}>新注册客户量：<span style={{color: 'red',fontSize: '18px'}}>{this.props.customerStatisticssStores.detail.create_total}</span></span>,
                                <span style={{marginRight: 20}}>总注册客户量：<span style={{color: 'red',fontSize: '18px'}}>{this.props.customerStatisticssStores.detail.total}</span></span>
                            ] : null
                        }
                        {
                            this.state.value === "obtained" ? [
                                <span style={{marginRight: 20}}>下架业务量：<span style={{color: 'red',fontSize: '18px'}}>{this.props.customerStatisticssStores.detail.under_total}</span></span>,
                                <span style={{marginRight: 20}}>下架业务预计月营收：<span style={{color: 'red',fontSize: '18px'}}>{this.props.customerStatisticssStores.detail.under_money}</span></span>,
                                <span style={{marginRight: 20}}>总下架业务量：<span style={{color: 'red',fontSize: '18px'}}>{this.props.customerStatisticssStores.detail.total}</span></span>,
                                <span style={{marginRight: 20}}>总下架业务预计月营收：<span style={{color: 'red',fontSize: '18px'}}>{this.props.customerStatisticssStores.detail.total_money}</span></span>
                            ] : null
                        }
                        {
                            this.state.value === "new" ? [
                                <span style={{marginRight: 20}}>新增业务量：<span style={{color: 'red',fontSize: '18px'}}>{this.props.customerStatisticssStores.detail.new_total}</span></span>,
                                <span style={{marginRight: 20}}>新增业务预计营收：<span style={{color: 'red',fontSize: '18px'}}>{this.props.customerStatisticssStores.detail.new_money}</span></span>,
                                <span style={{marginRight: 20}}>总业务量：<span style={{color: 'red',fontSize: '18px'}}>{this.props.customerStatisticssStores.detail.total}</span></span>,
                                <span style={{marginRight: 20}}>总业务预计营收：<span style={{color: 'red',fontSize: '18px'}}>{this.props.customerStatisticssStores.detail.total_money}</span></span>
                            ] : null
                        }
                    </div>
                </div>
            )}
          />
          </TabComponent>
        );
      }
}
CustomerStatisticsList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CustomerStatisticsList);
