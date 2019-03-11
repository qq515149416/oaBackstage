import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";

import AddOrder from "../component/dialog/addOrder.jsx";

const columnData = [
    { id: 'memory_number', numeric: true, disablePadding: false, label: '内存编码' },
    { id: 'memory_param', numeric: true, disablePadding: false, label: '内存参数' },
    { id: 'memory_used', numeric: true, disablePadding: false, label: '使用状态' },
    { id: 'room', numeric: true, disablePadding: false, label: '机房名称' },
    { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
    { id: 'updated_at', numeric: true, disablePadding: false, label: '更新时间' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作', extend: true, extendElement: (data) => {
        return (
            <AddOrder {...data} nameParam="memory_param" />
        )
} }
];
const inputType = [
    {
        field: "memory_number",
        label: "内存编码",
        type: "text"
    },
    {
        field: "memory_param",
        label: "内存参数",
        type: "text"
    },
    {
        field: "room_id",
        label: "所属机房",
        type: "select",
        defaultData: []
    }
];
@inject("memorysStores")
@observer
class MemoryList extends React.Component {
    componentDidMount() {
        this.props.memorysStores.getData();
    }
    addData = (param,callbrak) => {
        // console.log(param);
        this.props.memorysStores.addData(param).then((state) => {
          callbrak(state);
        });
    }
    changeData = (param,callbrak) => {
        const {memorysStores} = this.props;
        memorysStores.changeData(param).then((state) => {
          callbrak(state);
        });
    }
    delData = (selectedData,callbrak) => {
        const {memorysStores} = this.props;
        let delIng = selectedData.map(item => memorysStores.delData(item));
        callbrak(delIng);
    }
    render() {
        inputType[inputType.findIndex(item => item.field=="room_id")].defaultData = this.props.memorysStores.comprooms.map(item => {
            return {
              value: item.roomid,
              text: item.machine_room_name
            }
        });
        return (
          <ListTableComponent
            title="内存资源管理"
            operattext="内存资源"
            inputType={inputType}
            headTitlesData={columnData}
            data={this.props.memorysStores.memorys}
            currentStores={this.props.memorysStores}
            addData={this.addData.bind(this)}
            changeData={this.changeData.bind(this)}
            delData={this.delData.bind(this)}
          />
        );
      }
}
export default MemoryList;
