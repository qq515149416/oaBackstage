import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import TabComponent from "../component/tabComponent.jsx";

const styles = theme => ({
    listTableComponent: {
        marginTop: 0,
        borderRadius: "0 0 4px 4px",
        boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    }
});

let columnData = [
    { id: 'client_name', numeric: true, disablePadding: false, label: '客户' },
    { id: 'sales_name', numeric: true, disablePadding: false, label: '业务员' },
    { id: 'machine_number', numeric: true, disablePadding: false, label: '机器编号' },
    { id: 'resourcetype', numeric: true, disablePadding: false, label: '业务类型' },
    { id: 'length', numeric: true, disablePadding: false, label: '累计时长' },
    { id: 'price', numeric: true, disablePadding: false, label: '单价' },
    { id: 'ip', numeric: true, disablePadding: false, label: 'IP' },
    { id: 'updated_at', numeric: true, disablePadding: false, label: '下架时间' },
    { id: 'remove_status', numeric: true, disablePadding: false, label: '下架状态' },
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
    ]}
];

const inputType = [
];

@inject("disposalHistorysStores")
@observer
class DisposalHistoryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1
        };
    }
    componentDidMount() {
        this.props.disposalHistorysStores.getData(this.state.type);
    }
    handleChange = (value) => {
        this.props.disposalHistorysStores.getData(value);
        switch(value) {
            case 1:
            columnData = [
                { id: 'client_name', numeric: true, disablePadding: false, label: '客户' },
                { id: 'sales_name', numeric: true, disablePadding: false, label: '业务员' },
                { id: 'machine_number', numeric: true, disablePadding: false, label: '机器编号' },
                { id: 'resourcetype', numeric: true, disablePadding: false, label: '业务类型' },
                { id: 'length', numeric: true, disablePadding: false, label: '累计时长' },
                { id: 'price', numeric: true, disablePadding: false, label: '单价' },
                { id: 'ip', numeric: true, disablePadding: false, label: 'IP' },
                { id: 'updated_at', numeric: true, disablePadding: false, label: '下架时间' },
                { id: 'remove_status', numeric: true, disablePadding: false, label: '下架状态' },
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
                ]}
            ]
            break;
            case 2:
            columnData = [
                { id: 'customer_name', numeric: true, disablePadding: false, label: '客户' },
                { id: 'business_name', numeric: true, disablePadding: false, label: '业务员' },
                { id: 'resource', numeric: true, disablePadding: false, label: '资源' },
                { id: 'resourcetype', numeric: true, disablePadding: false, label: '资源类型' },
                { id: 'length', numeric: true, disablePadding: false, label: '累计时长' },
                { id: 'price', numeric: true, disablePadding: false, label: '单价' },
                { id: 'updated_at', numeric: true, disablePadding: false, label: '下架时间' },
                { id: 'remove_status', numeric: true, disablePadding: false, label: '下架状态' },
                { id: 'operat', numeric: true, disablePadding: false, label: '操作',  extend: true, extendData: [
                    {id: "business_sn", label: "业务号", type: "text"},
                    {id: "order_sn", label: "订单号", type: "text"},
                    {id: "remove_reason", label: "下架原因", type: "text"},
                    {id: "machine_sn", label: "资源值", type: "text"},
                ]}
            ]
            break;
        }
        this.setState({ value });
    }
    render() {
        const {classes} = this.props;
        return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
                {
                    label: "业务记录",
                    value: 1
                },
                {
                    label: "订单记录",
                    value: 2
                }
            ]}>
                <ListTableComponent
                    className={classes.listTableComponent}
                    title="业务下架记录"
                    operattext="业务下架"
                    inputType={inputType}
                    headTitlesData={columnData}
                    data={this.props.disposalHistorysStores.disposalHistorys}
                    currentStores={this.props.disposalHistorysStores}
                />
            </TabComponent>
        );
    }
}
DisposalHistoryList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(DisposalHistoryList);
