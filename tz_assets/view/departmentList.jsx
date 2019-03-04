import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";

const columnData = [
    { id: 'depart_number', numeric: true, disablePadding: false, label: '部门编号' },
    { id: 'depart_name', numeric: true, disablePadding: false, label: '部门名称' },
    { id: 'sign_name', numeric: true, disablePadding: false, label: '部门标志' },
    { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
    { id: 'updated_at', numeric: true, disablePadding: false, label: '更新时间' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
];
const inputType = [
    {
        field: "depart_number",
        label: "部门编号",
        type: "text"
    },
    {
        field: "depart_name",
        label: "部门名称",
        type: "text"
    },
    {
        field: "sign",
        label: "工单处理部门",
        type: "switch",
        radioData: [
            {
                checked: true,
                value: "1",
                label: "普通"
            },
            {
                checked: false,
                value: "2",
                label: "工单初始部门"
            },
            {
                checked: false,
                value: "3",
                label: "工单处理部门"
            },
            {
                checked: false,
                value: "4",
                label: "业务部门"
            }
        ]
    }
];
@inject("departmentsStores")
@observer
class DepartmentList extends React.Component {
    componentDidMount() {
        this.props.departmentsStores.getData();
    }
    addData = (param,callbrak) => {
        this.props.departmentsStores.addData(param).then((state) => {
          callbrak(state);
        });
    }
    changeData = (param,callbrak) => {
        const {departmentsStores} = this.props;
        departmentsStores.changeData(param).then((state) => {
          callbrak(state);
        });
    }
    delData = (selectedData,callbrak) => {
        const {departmentsStores} = this.props;
        let delIng = selectedData.map(item => departmentsStores.delData(item));
        callbrak(delIng);
    }
    render() {
        return (
          <ListTableComponent
            title="部门管理"
            operattext="部门"
            inputType={inputType}
            headTitlesData={columnData}
            data={this.props.departmentsStores.departments}
            currentStores={this.props.departmentsStores}
            addData={this.addData.bind(this)}
            changeData={this.changeData.bind(this)}
            delData={this.delData.bind(this)}
          />
        );
      }
}
export default DepartmentList;
