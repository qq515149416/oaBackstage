import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
const columnData = [
    { id: 'name', numeric: true, disablePadding: false, label: '名字' },
    { id: 'role', numeric: true, disablePadding: false, label: '角色身份' },
    { id: 'username', numeric: true, disablePadding: false, label: '账号' },
    { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
    { id: 'updated_at', numeric: true, disablePadding: false, label: '更新时间' },
    { id: 'operat', numeric: true, disablePadding: false,  label: '操作' }
];
const inputType = [

];
const filterType = [

];
@inject("employeeManagementsStores")
@observer
class EmployeeManagementList extends React.Component {
    componentDidMount() {
        this.props.employeeManagementsStores.getData();
    }
    filterData = (param) => {
        const {employeeManagementsStores} = this.props;
        employeeManagementsStores.filterData(param);
    }
    render() {
        return (
          <ListTableComponent
            title="员工管理"
            operattext="工作人员"
            inputType={inputType}
            headTitlesData={columnData}
            filterType={filterType}
            data={this.props.employeeManagementsStores.employeeManagements}
            currentStores={this.props.employeeManagementsStores}
            filterData={this.filterData.bind(this)}
          />
        );
      }
}
export default EmployeeManagementList;
