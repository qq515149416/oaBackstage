import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";

const styles = theme => ({
    listTableComponent: {
        marginTop: 0,
        borderRadius: "0 0 4px 4px",
        boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    },
    listFilterComponent: {
        marginTop: 0,
        borderRadius: "0",
        boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    }
});

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
    { id: 'cabinet_id', numeric: true, disablePadding: true, label: '机柜编号' },
    { id: 'use_state_cn', numeric: true, disablePadding: false, label: '使用状态' },
    // { id: 'machine_count', numeric: true, disablePadding: false, label: '机器数量' },
    { id: 'machine_room_name', numeric: true, disablePadding: false, label: '机房' },
    { id: 'note', numeric: true, disablePadding: false, label: '备注' },
    { id: 'use_type_cn', numeric: true, disablePadding: false ,label: '使用类型' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
];
/**
 * @var inputType 添加数据时对应字段的输入组件
 */
const inputType = [
  {
    field: "cabinet_id",
    label: "机柜编号",
    type: "text"
  },
  {
    field: "use_type",
    label: "使用类型",
    radioData: [
        {
          checked: true,
          value: "0",
          label: "内部机柜"
        },
        {
          checked: false,
          value: "1",
          label: "客户机"
        }
      ],
      model: {
        selectCode: (data) => {
          switch(data) {
            case "内部机柜":
                return 0;
            case "客户机":
                return 1;
            default:
                return data;
          }
        }
    },
    type: "switch"
  },
  {
    field: "note",
    label: "备注信息",
    type: "text"
  },
  {
    field: "machineroom_id",
    label: "所属机房",
    type: "select",
    defaultData: []
  }
];
const filterType = [
];
/**
 * 机柜管理
 */
@inject("cabinetsStores")
@observer
class CabinetList extends React.Component {
  componentDidMount() {
    this.props.cabinetsStores.getData();
  }
//   添加机柜
  addData = (param,callbrak) => {
    // console.log(param);
    this.props.cabinetsStores.addData(param).then((state) => {
      callbrak(state);
    });
  }
  //   删除机柜
  delData = (selectedData,callbrak) => {
    const {cabinetsStores} = this.props;
    let delIng = selectedData.map(item => cabinetsStores.delData(item));
    callbrak(delIng);
  }
//   更新机柜
  changeData = (param,callbrak) => {
        const {cabinetsStores} = this.props;
        cabinetsStores.changeData(param).then((state) => {
        callbrak(state);
        });
    }
    // 机柜筛选
    filterData = (param) => {
        const {cabinetsStores} = this.props;
        cabinetsStores.filterData(param);
    }
  /**
 * 渲染方法
 * @class ListTableComponent 这个是渲染一个table组件
 */
  render() {
    const {classes} = this.props;
    inputType[inputType.findIndex(item => item.field=="machineroom_id")].defaultData = this.props.cabinetsStores.comprooms.map(item => {
      return {
        value: item.roomid,
        text: item.machine_room_name
      }
    });
    return (
      <ListTableComponent
        className={classes.listTableComponent}
        listFilterComponentClassName={classes.listFilterComponent}
        title="机柜资源库"
        operattext="机柜资源"
        inputType={inputType}
        headTitlesData={columnData}
        filterType={filterType}
        data={this.props.cabinetsStores.cabinets}
        delData={this.delData.bind(this)}
        currentStores={this.props.cabinetsStores}
        changeData={this.changeData.bind(this)}
        addData={this.addData.bind(this)}
        filterData={this.filterData.bind(this)}
      />
    );
  }
}

CabinetList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CabinetList);
