import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import CustomizeTableToolbar from "../component/listTable/customizeTableToolbar.jsx";

const columnData = [
    { id: 'customer', numeric: true, disablePadding: false, label: '客户' },
    { id: 'salesman', numeric: true, disablePadding: false, label: '业务员' },
    { id: 'machine_sn', numeric: true, disablePadding: false, label: '产品信息' },
    { id: 'type', numeric: true, disablePadding: false, label: '产品类型' },
    { id: 'duration', numeric: true, disablePadding: false, label: '合同期（月）' },
    { id: 'price', numeric: true, disablePadding: false, label: '单价' },
    { id: 'money', numeric: true, disablePadding: false, label: '预计金额' },
    { id: 'created_at', numeric: true, disablePadding: false, label: '时间' },
];


const inputType = [
];
@inject("businessStatisticssStores")
@observer
class BusinessStatisticssList extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.businessStatisticssStores.getData();
    }

    render() {
        return (
            <ListTableComponent
            title="业务出售情况"
            operattext="统计管理"
            inputType={inputType}
            headTitlesData={columnData}
            data={this.props.businessStatisticssStores.businessStatisticss}
            currentStores={this.props.businessStatisticssStores}
            customizeToolbar={(
                <div>
                    <CustomizeTableToolbar type="datetime-local" getData={this.props.businessStatisticssStores.getData} />
                    <div style={{fontSize: "16px",marginTop: 20}}>
                    <span style={{marginRight: 20}}>当前查询的总量：<span style={{color: 'red',fontSize: '18px'}}>{this.props.businessStatisticssStores.detail.orders_total}</span></span>
                    <span style={{marginRight: 20}}>当前查询的预计总金额：<span style={{color: 'red',fontSize: '18px'}}>{this.props.businessStatisticssStores.detail.total}</span></span>
                    </div>
                </div>
            )}
          />
        );
      }
}
export default BusinessStatisticssList;
