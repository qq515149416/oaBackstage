import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";

/**
 * @var columnData table渲染数据的字段的头部名称
 * @var columnData.operat 属性是table表格种对应的操作功能字段，分别有：
 * extendData、extendConfirm、extendElement、extendUrl方法
 * extendData属性是能够以点击的形式通过弹框显示多余数据
 * extendConfirm属性是一个提示框
 * extendElement属性能够渲染你自定义的组件
 * extendUrl属性能指定跳转链接
 */
const columnData = [
    { id: 'cpu_number', numeric: true, disablePadding: false, label: 'cpu编码' },
    { id: 'cpu_param', numeric: true, disablePadding: false, label: 'cpu参数' },
    { id: 'cpu_used', numeric: true, disablePadding: false, label: '使用状态' },
    { id: 'room', numeric: true, disablePadding: false, label: '机房名称' },
    { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
    { id: 'updated_at', numeric: true, disablePadding: false, label: '更新时间' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
];
/**
 * @var inputType 添加数据时对应字段的输入组件
 */
const inputType = [
    {
        field: "cpu_number",
        label: "cpu编码",
        type: "text"
    },
    {
        field: "cpu_param",
        label: "cpu参数",
        type: "text"
    },
    {
        field: "room_id",
        label: "所属机房",
        type: "select",
        defaultData: []
    }
];
/**
 * cpu资源管理
 * */
@inject("cpusStores")
@observer
class CpuList extends React.Component {
    componentDidMount() {
        this.props.cpusStores.getData();//获取cpu资源数据
    }
    // 添加cpu
    addData = (param,callbrak) => {
        // console.log(param);
        this.props.cpusStores.addData(param).then((state) => {
          callbrak(state);
        });
    }
    // 更新cpu
    changeData = (param,callbrak) => {
        const {cpusStores} = this.props;
        cpusStores.changeData(param).then((state) => {
          callbrak(state);
        });
    }
    // 删除cpu
    delData = (selectedData,callbrak) => {
        const {cpusStores} = this.props;
        let delIng = selectedData.map(item => cpusStores.delData(item));
        callbrak(delIng);
    }
    /**
 * 渲染方法
 * @class ListTableComponent 这个是渲染一个table组件
 */
    render() {
        inputType[inputType.findIndex(item => item.field=="room_id")].defaultData = this.props.cpusStores.comprooms.map(item => {
            return {
              value: item.roomid,
              text: item.machine_room_name
            }
        });
        return (
          <ListTableComponent
            title="cpu资源管理"
            operattext="cpu资源"
            inputType={inputType}
            headTitlesData={columnData}
            data={this.props.cpusStores.cpus}
            currentStores={this.props.cpusStores}
            addData={this.addData.bind(this)}
            changeData={this.changeData.bind(this)}
            delData={this.delData.bind(this)}
          />
        );
      }
}
export default CpuList;
