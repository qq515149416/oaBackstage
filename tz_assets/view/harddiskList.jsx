import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";

const columnData = [
    { id: 'harddisk_number', numeric: true, disablePadding: false, label: '硬盘编码' },
    { id: 'harddisk_param', numeric: true, disablePadding: false, label: '硬盘参数' },
    { id: 'harddisk_used', numeric: true, disablePadding: false, label: '使用状态' },
    { id: 'room', numeric: true, disablePadding: false, label: '机房名称' },
    { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
    { id: 'updated_at', numeric: true, disablePadding: false, label: '更新时间' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
];
const inputType = [
    {
        field: "harddisk_number",
        label: "硬盘编码",
        type: "text"
    },
    {
        field: "harddisk_param",
        label: "硬盘参数",
        type: "text"
    },
    {
        field: "room_id",
        label: "所属机房",
        type: "select",
        defaultData: []
    }
];
@inject("harddisksStores")
@observer
class HarddiskList extends React.Component {
    componentDidMount() {
        this.props.harddisksStores.getData();
    }
    addData = (param,callbrak) => {
        // console.log(param);
        this.props.harddisksStores.addData(param).then((state) => {
          callbrak(state);
        });
    }
    changeData = (param,callbrak) => {
        const {harddisksStores} = this.props;
        harddisksStores.changeData(param).then((state) => {
          callbrak(state);
        });
    }
    delData = (selectedData,callbrak) => {
        const {harddisksStores} = this.props;
        let delIng = selectedData.map(item => harddisksStores.delData(item));
        callbrak(delIng);
    }
    render() {
        inputType[inputType.findIndex(item => item.field=="room_id")].defaultData = this.props.harddisksStores.comprooms.map(item => {
            return {
              value: item.roomid,
              text: item.machine_room_name
            }
        });
        return (
          <ListTableComponent
            title="硬盘资源管理"
            operattext="硬盘资源"
            inputType={inputType}
            headTitlesData={columnData}
            data={this.props.harddisksStores.harddisks}
            currentStores={this.props.harddisksStores}
            addData={this.addData.bind(this)}
            changeData={this.changeData.bind(this)}
            delData={this.delData.bind(this)}
          />
        );
      }
}
export default HarddiskList;
