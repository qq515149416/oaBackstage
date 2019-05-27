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

const columnData = [
    { id: 'customer', numeric: true, disablePadding: false, label: '客户' },
    { id: 'salesman', numeric: true, disablePadding: false, label: '业务员' },
    { id: 'machine_sn', numeric: true, disablePadding: false, label: '产品信息' },
    { id: 'machineroom_name', numeric: true, disablePadding: false, label: '机房' },
    { id: 'type', numeric: true, disablePadding: false, label: '产品类型' },
    { id: 'duration', numeric: true, disablePadding: false, label: '合同期（月）' },
    { id: 'price', numeric: true, disablePadding: false, label: '单价' },
    { id: 'money', numeric: true, disablePadding: false, label: '预计金额' },
    { id: 'created_at', numeric: true, disablePadding: false, label: '时间' },
];


const inputType = [
];

const filterType = [
    {
        field: "created_at",
        label: "时间",
        type: "date"
    }
];

@inject("businessStatisticssStores")
@observer
class BusinessStatisticssList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 4
        }
    }
    componentDidMount() {
        this.props.businessStatisticssStores.getData();
    }

    handleChange = (value) => {
        this.props.businessStatisticssStores.getData({
            str: value
        });
        this.setState({ value });
    }

    filterData = (param) => {
        const {businessStatisticssStores} = this.props;
        businessStatisticssStores.filterData(param);
      }

    render() {
        const {classes} = this.props;
        const { value } = this.state;
        return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
                {
                    label: "生效业务",
                    value: 4
                },
                {
                    label: "全部",
                    value: 1
                },
                {
                    label: "使用中",
                    value: 2
                },
                {
                    label: "下架",
                    value: 3
                }
            ]}>
                <ListTableComponent
                title={`当前查询的总量：${this.props.businessStatisticssStores.businessStatisticss.length}&nbsp;&nbsp;&nbsp;&nbsp;当前查询的预计总金额：${this.props.businessStatisticssStores.businessStatisticss.reduce((a,b) => a + parseFloat(b.money),0).toFixed(2)}&nbsp;&nbsp;&nbsp;&nbsp;当前预计月营收：${this.props.businessStatisticssStores.businessStatisticss.reduce((a,b) => a + parseFloat(b.price),0).toFixed(2)}`}
                operattext="统计管理"
                inputType={inputType}
                headTitlesData={columnData}
                filterType={filterType}
                data={this.props.businessStatisticssStores.businessStatisticss}
                className={classes.listTableComponent}
                currentStores={this.props.businessStatisticssStores}
                filterData={this.filterData.bind(this)}
            />
          </TabComponent>
        );
      }
}
BusinessStatisticssList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(BusinessStatisticssList);
