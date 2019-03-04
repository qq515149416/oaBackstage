import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import DepartSelect from "../component/dialog/departSelect.jsx";

const columnData = [
    { id: 'machine_room_id', numeric: true, disablePadding: false, label: '机房编号' },
    { id: 'machine_room_name', numeric: true, disablePadding: false, label: '机房中文名' },
    { id: 'list_order', numeric: true, disablePadding: false, label: '所属部门' },
    { id: 'white_list_add', numeric: true, disablePadding: false, label: '白名单api' },
    { id: 'white_list_key', numeric: true, disablePadding: false, label: 'api密钥' },
    // { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
    // { id: 'updated_at', numeric: true, disablePadding: false, label: '更新时间' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
];
const inputType = [
  {
    field: "machine_room_id",
    label: "机房编号",
    type: "text"
  },
  {
    field: "machine_room_name",
    label: "机房中文名",
    type: "text"
  },
  {
    field: "white_list_add",
    label: "白名单管理api",
    type: "text"
  },
  {
    field: "white_list_key",
    label: "api密钥",
    type: "text"
  },
  {
    field: "depart_id",
    label: "所属部门",
    type: "component",
    defaultData: [],
    Component: DepartSelect,
    param: {
        buttonName: "选择部门"
    }
  }
];
@inject(stores => ({
    MachineRoomsStores: stores.MachineRoomsStores,
    departmentsStores: stores.departmentsStores
}))
@observer
class MachineRoomList extends React.Component {
  componentDidMount() {
    this.props.MachineRoomsStores.getData();
    this.getDepartData();
  }
  getDepartData = () => {
    this.props.departmentsStores.getData();
  }
  addData = (param,callbrak) => {
    // console.log(param);
    this.props.MachineRoomsStores.addData(param).then(state => {
      callbrak(state);
    });
  }
  changeData = (param,callbrak) => {
    const {MachineRoomsStores} = this.props;
    MachineRoomsStores.changeData(param).then((state) => {
      callbrak(state);
    });
  }
  delData = (selectedData,callbrak) => {
    const {MachineRoomsStores} = this.props;
    let delIng = selectedData.map(item => MachineRoomsStores.delData(item));
    callbrak(delIng);
  }
  render() {
    inputType[inputType.findIndex(item => item.field=="depart_id")].defaultData = this.props.departmentsStores.departments.map(item => {
        return {
          value: item.id,
          text: item.depart_name
        }
    });
    return (
      <ListTableComponent
        title="机房管理"
        operattext="机房"
        inputType={inputType}
        headTitlesData={columnData}
        data={this.props.MachineRoomsStores.machineRooms}
        currentStores={this.props.MachineRoomsStores}
        addData={this.addData.bind(this)}
        delData={this.delData.bind(this)}
        changeData={this.changeData.bind(this)}
      />
    );
  }
}
export default MachineRoomList;
