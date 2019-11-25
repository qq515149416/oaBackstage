import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import {post} from "../tool/http.js";
import { inject,observer } from "mobx-react";
import Approval from "../component/icon/approval.jsx";
const classNames = require('classnames');
/**
 *@var  styles 是用来定义样式的
 */
const styles = theme => ({
    fastExpired: {
        background: "orange"
    },
    expired: {
        background: "crimson"
    },
    tableHover: {
       "&:hover": {
            backgroundColor: "#3c8dbc !important"
       }
    },
    textStyle: {
        fontSize: 16
    },
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
    { id: 'client_name', numeric: true, disablePadding: true, label: '客户' },
    { id: 'sales_name', numeric: true, disablePadding: true, label: '业务员' },
    { id: 'business_number', numeric: true, disablePadding: true, label: '业务号' },
    { id: 'type', numeric: true, disablePadding: true, label: '业务类型' },
    { id: 'machine_number', numeric: true, disablePadding: true, label: '机器/机柜编号' },
    { id: 'status', numeric: true, disablePadding: true, label: '业务状态' },
    { id: 'ip', numeric: true, disablePadding: true, label: 'IP' },
    { id: 'machineroom_name', numeric: true, disablePadding: true, label: '所属机房' },
    { id: 'cabinets', numeric: true, disablePadding: true, label: '所属机柜' },
    { id: 'remove', numeric: true, disablePadding: true, label: '下架状态' },
    { id: 'monthly', numeric: true, disablePadding: true, label: '月结日' },
    { id: 'endding_time', numeric: true, disablePadding: true, label: '到期时间' },
    { id: 'operat', numeric: true, disablePadding: false, extend: true, extendData: [
        {id: "order_number", label: "订单号", type: "text"},
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
        ]},
        {id: "money", label: "单价" ,type: "text"},
        {id: "length", label: "时长" ,type: "text"},
        {id: "start_time", label: "业务开始时间" ,type: "text"},
        // {id: "endding_time", label: "业务结束时间" ,type: "text"},
        {id: "business_note", label: "业务备注" ,type: "text"},
        {id: "check_note", label: "审核备注" ,type: "text"}
    ], extendConfirm: {
        rule: {
            term: "business_status",
            execute: 0,
            type: "equal"
        },
        icon: <Approval />,
        title: "审核操作",
        content: "是否要通过此业务审核",
        input: true,
        select: true,
        selectOptions: [
            {
                text: "审核通过",
                value: 1
            },
            {
                text: "审核不通过",
                value: -2,
                default: true
            }
    ],
      ok: (data,param) => {
        return new Promise((resolve,reject) => {
            post("business/check",{
                business_number: data.business_number,
                business_status: param,
                check_note: data.note,
                parent_business: data.parent_business
            }).then((res) => {
                if(res.data.code==1) {
                    alert("审核成功");
                    resolve(res.data);
                } else {
                    alert(res.data.msg);
                    resolve(res.data);
                }
            }).catch(reject);
        });
      },
    //   cancel: (data) => {
    //     return new Promise((resolve,reject) => {
    //       post("business/check",{
    //           business_number: data.business_number,
    //           business_status: -2,
    //           check_note: data.note
    //       }).then((res) => {
    //           if(res.data.code==1) {
    //               alert("审核成功");
    //               resolve(res.data);
    //           } else {
    //               alert(res.data.msg);
    //               resolve(res.data);
    //           }
    //       }).catch(reject);
    //   });
    //   }
    }, label: '操作' }
];
/**
 * @var inputType 添加数据时对应字段的输入组件
 */
const inputType = [
];
/**
 * @var filterType 搜索数据时对应字段的输入组件
 */
const filterType = [
];
/**
 * 审核上架机器
 */
@inject("businessStores")
@observer
class CheckBusinessList extends React.Component {
  componentDidMount() {
    this.props.businessStores.getAllData(); //获取数据
  }
//   批量审核
  checkAll(selectedData,callbrak) {
    const {businessStores} = this.props;
    let delIng = selectedData.map(item => businessStores.checkAll(item));
    callbrak(delIng);
  }
//   更新数据
  updata() {
    this.props.businessStores.getAllData();
  }
   //   过滤充值记录
   filterData = (param) => {
    const {businessStores} = this.props;
    businessStores.filterData(param);
  }
   /**
 * 渲染方法
 * @class ListTableComponent 这个是渲染一个table组件
 */
  render() {
    const {classes} = this.props;
    return (
      <ListTableComponent
        title="业务管理"
        operattext="业务信息"
        inputType={inputType}
        filterType={filterType}
        headTitlesData={columnData}
        data={this.props.businessStores.business}
        currentStores={this.props.businessStores}
        checkAll={this.checkAll.bind(this)}
        updata={this.updata.bind(this)}
        filterData={this.filterData.bind(this)}
        nosort={true}
        tableRowStyle={data => {
            return {
                classes: {
                    root: classNames({
                        [classes.expired]: data.business_status == 0
                    }),
                    hover: classes.tableHover
                }
            };
        }}
      />
    );
  }
}
CheckBusinessList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CheckBusinessList);
