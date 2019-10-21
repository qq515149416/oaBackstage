import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import {post} from "../tool/http.js";
import extendElementsComponent from "../tool/extendElementsComponent";
import ResetPassword from "../component/dialog/resetPassword.jsx";
import ManualRecharge from "../component/dialog/manualRecharge.jsx";
import InputUserInfo from "../component/dialog/inputUserInfo.jsx";
import RechargeRecord from "../component/icon/rechargeRecord.jsx";
import Defense from "../component/icon/defense.jsx";
import PersonnelTransfer from "../component/dialog/personnelTransfer.jsx";
import { routerConfig } from "../config/common/config.js";
import Finance from "../component/icon/finance.jsx";
import Backup from "@material-ui/icons/Backup";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
const classNames = require('classnames');

const styles = theme => ({
    expired: {
        background: "crimson"
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
    { id: 'name', numeric: true, disablePadding: false, label: '用户名' },
    { id: 'nickname', numeric: true, disablePadding: false, label: '昵称' },
    { id: 'email', numeric: true, disablePadding: false, label: '邮箱' },
    { id: 'money', numeric: true, disablePadding: false, label: '余额' },
    { id: 'clerk_name', numeric: true, disablePadding: false, label: '业务员' },
    { id: 'status', numeric: true, disablePadding: false, label: '状态' },
    { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
    { id: 'operat', numeric: true, disablePadding: false, extend: true,  extendConfirm: {
        last: true,
        title: "更改状态操作",
        content: "是否要更改此用户状态",
        select: true,
        selectOptions: [
            {
                text: "拉黑",
                value: 0
            },
            {
                text: "正常",
                value: 2,
                default: true
            },
            {
                text: "未验证",
                value: 1
            }
        ],
        ok: (data,param) => {
            return new Promise((resolve,reject) => {
                post("business/pull_black",{
                    status: param,
                    id: data.id
                }).then((res) => {
                    if(res.data.code==1) {
                        alert(res.data.msg);
                        resolve(res.data);
                    } else {
                        alert(res.data.msg);
                        resolve(res.data);
                    }
                }).catch(reject);
            });
        }
      } ,extendElement: (data,update) => {
        let Element = extendElementsComponent([
            InputUserInfo,
            ResetPassword,
            ManualRecharge,
            PersonnelTransfer
          ]);
        return <Element postUrl="business/recharge" update={update} nameParam="nickname" {...data} />;
    }, extendUrl: [
        {
            title: "添加业务",
            link: `${routerConfig.baseUrl}/business`,
            param: ["id","nickname","money","status","clerk_name"]
        },
        {
            title: "充值记录",
            link: `${routerConfig.baseUrl}/checkrecharge`,
            param: ["id"],
            icon: <RechargeRecord />
        },
        {
            title: "高防IP业务",
            link: `${routerConfig.baseUrl}/defenseBusines`,
            param: ["id","email"],
            icon: <Defense />
        },
        {
            title: "叠加包业务",
            link: `${routerConfig.baseUrl}/overlayBusiness`,
            param: ["id","email"],
            icon: <Backup />
        },
        {
            title: "财务统计",
            link: `${routerConfig.baseUrl}/statisticalPerformance`,
            param: ["id"],
            icon: <Finance />
        },
        {
            title: "发票管理",
            link: `${routerConfig.baseUrl}/invoice`,
            param: ["id"],
            icon: <InsertDriveFileIcon />
        }
    ], label: '操作' }
];
/**
 * @var inputType 添加数据时对应字段的输入组件
 */
const inputType = [
    {
        field: "isBinding",
        radioData: [
            {
                checked: true,
                value: "0",
                label: "创建客户"
            },
            {
                checked: false,
                value: "1",
                label: "绑定客户"
            }
        ],
        type: "switch",
        group: "root"
    },
    {
        field: "email",
        label: "用户邮箱",
        type: "text",
        group: "1"
    },
    {
        field: "name",
        label: "用户名",
        type: "text",
        group: "0"
    },
    {
        field: "nickname",
        label: "昵称",
        type: "text",
        group: "0"
    },
    {
        field: "password",
        label: "密码",
        type: "text",
        group: "0"
    },
    {
        field: "password_confirmation",
        label: "确认密码",
        type: "text",
        group: "0"
    },
    {
        field: "msg_qq",
        label: "QQ",
        type: "text",
        group: "0"
    },
    {
        field: "msg_phone",
        label: "手机号码",
        type: "text",
        group: "0"
    },
    {
        field: "remarks",
        label: "备注",
        type: "text",
        group: "0"
    }
];
/**
 * @var filterType 过滤选择的字段
 */
const filterType = [

];
/**
 * 客户管理
 */
@inject("clientelesStores")
@observer
class ClienteleList extends React.Component {
    componentDidMount() {
        this.props.clientelesStores.getData(); //获取数据
    }
    //   更新数据
    updata() {
        this.props.clientelesStores.getData();
    }
    // 业务员绑定客户
    addData = (param,callbrak) => {
        this.props.clientelesStores.bingSalesman(param).then((state) => {
          callbrak(state);
        });
    }
    //   过滤业务
  filterData = (param) => {
    const {clientelesStores} = this.props;
    clientelesStores.filterData(param);
  }
    /**
 * 渲染方法
 * @class ListTableComponent 这个是渲染一个table组件
 */
    render() {
        const {classes} = this.props;
        return (
          <ListTableComponent
            title="CRM管理"
            operattext="客户"
            addTitle="绑定客户"
            headTitlesData={columnData}
            inputType={inputType}
            filterType={filterType}
            data={this.props.clientelesStores.clienteles}
            addData={this.addData.bind(this)}
            updata={this.updata.bind(this)}
            filterData={this.filterData.bind(this)}
            currentStores={this.props.clientelesStores}
            tableRowStyle={data => {
                return {
                    classes: {
                        root: classNames({
                            [classes.expired]: data.haveBusiness == 0
                        })
                    }
                };
            }}
          />
        );
      }
}
ClienteleList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ClienteleList);
