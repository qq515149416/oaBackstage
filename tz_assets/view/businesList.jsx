import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import InputExpansion from "../component/dialog/inputExpansion.jsx";
import StatisticsShowComponent from "../component/statisticsShowComponent.jsx";
import RenewalFee from "../component/dialog/renewalFee.jsx";
import WorkOrderPost from "../component/dialog/workOrderPost.jsx";
import { post,get } from "../tool/http.js";
import extendElementsComponent from "../tool/extendElementsComponent";
import Disposal from "../component/dialog/disposal.jsx";
import TabComponent from "../component/tabComponent.jsx";
import { inject,observer } from "mobx-react";
import { routerConfig } from "../config/common/config.js";
import ManualRecharge from "../component/dialog/manualRecharge.jsx";
// import Enable from "../component/icon/enable.jsx";
import Button from '@material-ui/core/Button';
import SelectPay from '../component/dialog/selectPay.jsx';
import AddResource from '../component/dialog/addResource.jsx';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ExpansionComponent from "../component/expansionComponent.jsx";
import GetResource from "../component/dialog/GetResource.jsx";
import OtherConsumption from "../component/dialog/otherConsumption.jsx";
const classNames = require('classnames');
const dateFormat = require('dateformat');
const qs = require('qs');

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

const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  }))(TableRow);

class Machine extends React.Component {
    state = {
        rows: [],
        expand: true
    }
    componentDidMount() {
        get("business/showcabinetmachine",{
            parent_business: this.props.data.id
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    rows: res.data.data
                });
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        get("business/showcabinetmachine",{
            parent_business: nextProps.data.id
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    rows: res.data.data
                });
            }
        });
    }
    handleClick = () => {
        this.setState(state => {
            state.expand = !state.expand;
            return state;
        });
    }
    render() {
        const { rows, expand } = this.state;
        return (
            rows.length ?
            (
                <TableRow>
                    <TableCell colSpan={this.props.headTitlesData.length+1}>
                        <div>
                            {
                            expand && (
                                <Table>
                                    <TableHead>
                                    <TableRow>
                                        <StyledTableCell>业务号</StyledTableCell>
                                        <StyledTableCell>机器编号</StyledTableCell>
                                        <StyledTableCell align="right">资源类型</StyledTableCell>
                                        <StyledTableCell align="right">IP</StyledTableCell>
                                        <StyledTableCell align="right">所属机房</StyledTableCell>
                                        <StyledTableCell align="right">所属机柜</StyledTableCell>
                                        <StyledTableCell align="right">业务状态</StyledTableCell>
                                        <StyledTableCell align="right">下架状态</StyledTableCell>
                                        <StyledTableCell align="right">操作</StyledTableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {rows.map(row => (
                                        <StyledTableRow key={row.business_number}>
                                            <StyledTableCell component="th" scope="row">
                                                {row.business_number}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">{row.machine_number}</StyledTableCell>
                                            <StyledTableCell align="right">{row.type}</StyledTableCell>
                                            <StyledTableCell align="right">{row.ip}</StyledTableCell>
                                            <StyledTableCell align="right">{row.machineroom_name}</StyledTableCell>
                                            <StyledTableCell align="right">{row.cabinets}</StyledTableCell>
                                            <StyledTableCell align="right">{row.status}</StyledTableCell>
                                            <StyledTableCell align="right">{row.remove}</StyledTableCell>
                                            <StyledTableCell align="right">
                                                <ExpansionComponent
                                                    type="show"
                                                    data={[
                                                        {id: "resource_detail", label: "资源详情", type: "subordinate", subordinate: [
                                                            {id: "machine_num", label: "机器编号", type: "text"},
                                                            {id: "cpu", label: "CPU", type: "text"},
                                                            {id: "memory", label: "内存", type: "text"},
                                                            {id: "harddisk", label: "硬盘", type: "text"},
                                                            {id: "bandwidth", label: "带宽", type: "text"},
                                                            {id: "protect", label: "防御", type: "text"},
                                                            {id: "loginname", label: "账号", type: "text"},
                                                            {id: "loginpass", label: "密码", type: "text"},
                                                            {id: "cabinets", label: "机柜编号", type: "text"}
                                                        ],getData: data => new Promise((resolve,reject) => {
                                                            get("business/cabinetmachinedetail",{
                                                                business_id: data.id
                                                            }).then(res => {
                                                                if(res.data.code==1) {
                                                                    resolve(res.data.data);
                                                                } else {
                                                                    resolve({});
                                                                }
                                                            }).catch(reject);
                                                        })},
                                                        {id: "client_name", label: "客户", type: "text"},
                                                        {id: "sales_name", label: "业务员", type: "text"},
                                                        {id: "money", label: "单价", type: "text"},
                                                        {id: "length", label: "累计时长", type: "text"},
                                                        {id: "start_time", label: "开始时间", type: "text"},
                                                        {id: "endding_time", label: "结束时间", type: "text"},
                                                        // {id: "remove", label: "下架状态", type: "text"},
                                                        {id: "business_note", label: "业务备注", type: "text"},
                                                        {id: "check_note", label: "审核备注", type: "text"}
                                                    ].map((item,index) => {
                                                        // console.log(item,i,arr);
                                                        return {
                                                        ...item,
                                                        content: row[item.id],
                                                        source: row
                                                        };
                                                    })}
                                                />
                                                <GetResource {...row} postUrl="business/change" nameParam="business_number" type="更换" />
                                                <Disposal {...row} disposal_type={1} postUrl="under/apply_under" nameParam="business_number" type="下架" />
                                                <ExpansionComponent
                                                    type="link"
                                                    title="更换记录"
                                                    link={routerConfig.baseUrl+"/resourceHistory?id="+row.id+"&parent_business="+row.parent_business}
                                                />
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            )
                            }
                            <Button fullWidth color="primary" onClick={this.handleClick}>
                                {expand ? "收起" : "展开"}
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            ) : null
        )
    }
}


/**
 * @var columnData table渲染数据的字段的头部名称
 * @var columnData.operat 属性是table表格种对应的操作功能字段，分别有：
 * extendData、extendConfirm、extendElement、extendUrl方法
 * extendData属性是能够以点击的形式通过弹框显示多余数据
 * extendConfirm属性是一个提示框
 * extendElement属性能够渲染你自定义的组件
 * extendUrl属性能指定跳转链接
 */
/**
 * @description 备份代码
 * extendConfirm: {
        rule: {//确认框规则
            term: "business_status",//验证属性
            execute: 0,//验证条件
            type: "min"//验证方式
        },
      title: "业务订单支付",//确认框标题
      content: "支付会支付业务下所有的订单",//确认框架信息
      icon: <Enable />,//确认框触发按钮
      ok: (data) => {
          return new Promise((resolve,reject) => {
              post("business/payOrderByAdmin",{
                business_number: data.business_number,
                coupon_id: 0
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
    }
 */
const columnData = [
    { id: 'business_number', numeric: true, disablePadding: true, label: '业务号' },
    { id: 'type', numeric: true, disablePadding: true, label: '业务类型' },
    { id: 'machine_number', numeric: true, disablePadding: true, label: '机器/机柜编号' },
    { id: 'status', numeric: true, disablePadding: true, label: '业务状态' },
    { id: 'resource_detail_json.ip', numeric: true, disablePadding: true, label: 'IP' },
    { id: 'resource_detail_json.machineroom_name', numeric: true, disablePadding: true, label: '所属机房' },
    { id: 'cabinets', numeric: true, disablePadding: true, label: '所属机柜' },
    { id: 'remove', numeric: true, disablePadding: true, label: '下架状态' },
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
        {id: "business_note", label: "业务备注" ,type: "text"}
    ],extendElement: (data,update) => {
        let components = [];
        if(data.business_status>1) {
            components = [
                RenewalFee,//续费
                WorkOrderPost,//提交工单
                Disposal,//下架
                SelectPay
            ];
        } else {
            if(data.business_status>0) {
                components = [
                    WorkOrderPost,//提交工单
                    Disposal,//下架
                    SelectPay
                ];
            } else {
                components = [
                    WorkOrderPost,//提交工单
                    Disposal//下架
                ];
            }
        }
        if(data.business_type==3) {
            components.push(AddResource);
        }

        let Element = extendElementsComponent(components);
          return <Element {...data} disposal_type={1} update={update} postUrl="business/renewresource" nameParam="machine_number" type="业务" />;
    //   if(data.business_status==2) {

    //   }else {
    //     let Element = extendElementsComponent([
    //         Disposal
    //     ]);
    //     return <Element {...data} disposal_type={1} postUrl="business/renewresource" nameParam="machine_number" type="业务" />;
    //   }
  }, extendUrl: [
    {
        title: "全部订单",
        link: routerConfig.baseUrl+"/business/order",
        param: ["business_number","client_id","client_name","machine_number",{
          field: "resource_detail_json",
          value: ["machineroom_id"]
        }]
    }
  ], label: '操作' }
];
/**
 * @var inputType 添加数据时对应字段的输入组件
 */
const inputType = [
  // {
  //   field: "client_name",
  //   label: "客户姓名",
  //   type: "text"
  // },
  {
    field: "money",
    label: "资源单价",
    type: "text"
  },
  {
    field: "length",
    label: "时长",
    type: "text"
  },
  {
    field: "business_note",
    label: "业务备注",
    type: "text"
  },
  {
    field: "business_type",
    label: "业务类型",
    type: "switch",
    radioData: [
        {
            checked: true,
            value: "1",
            label: "租用主机"
        },
        {
            checked: false,
            value: "2",
            label: "托管主机"
        },
        {
            checked: false,
            value: "3",
            label: "租用机柜"
        }
    ]

  },
  {
    field: "machine_number",
    label: "主机/机柜编号",
    type: "component",
    Component: InputExpansion,
    rule: {
      term: "business_type",
      execute: [
        {
          index: "1",
          value: "rent_machine",
          default: true
        },
        {
          index: "3",
          value: "cabinet"
        },
        {
          index: "2",
          value: "hosting_machine"
        }
      ],
      type: "component"
    }
  },
  {
    field: "showInfo",
    label: "",
    type: "component",
    Component: StatisticsShowComponent
  }
];
/**
 * @var filterType 过滤选择的字段
 */
const filterType = [
    {
        field: "status",
        label: "业务状态",
        options: [
            {
                view: "付款使用中"
            },
            {
                view: "未付款使用"
            },
            {
                view: "审核中"
            },
            {
                view: "审核不通过"
            },
            {
                view: "取消"
            },
            {
                view: "到期"
            },
            {
                view: "退款"
            }
        ],
        type: "select"
    },
    {
        field: "start_time",
        label: "创建时间",
        type: "date"
    }
];
/**
 * 业务管理
 */
@inject("businessStores")
@observer
class BusinesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1,
            customerInfo: {
                id: qs.parse(location.search.substr(1)).id,
                nickname: qs.parse(location.search.substr(1)).nickname,
                money: qs.parse(location.search.substr(1)).money,
                status: qs.parse(location.search.substr(1)).status,
                clerk_name: qs.parse(location.search.substr(1)).clerk_name
            }
        };
    }
  componentDidMount() {
    //   获取用户信息
    this.getCustomerInfo(qs.parse(location.search.substr(1)).id);
    //   通过客户ID获取对应的业务数据
    this.props.businessStores.getData(qs.parse(location.search.substr(1)).id,this.state.value);
    // inputType[inputType.findIndex(item => item.field=="client_name")].model = {
    //   getSubordinateData: this.setClientName.bind(this)
    // };
    // 绑定金额触发方法
    inputType[inputType.findIndex(item => item.field=="money")].model = {
      getSubordinateData: this.setMoneyName.bind(this)
    };
    // 绑定时长触发方法
    inputType[inputType.findIndex(item => item.field=="length")].model = {
      getSubordinateData: this.setLengthName.bind(this)
    };
    // 绑定业务类型触发方法
    inputType[inputType.findIndex(item => item.field=="business_type")].model = {
      getSubordinateData: this.setBusinessTypeName.bind(this)
    };
    // 绑定机器编号触发方法
    inputType[inputType.findIndex(item => item.field=="machine_number")].model = {
      getSubordinateData: this.setMachineNumberName.bind(this)
    };
  }
  // setClientName(param,type) {
  //   // console.log(param);
  //   this.props.businessStores.changeStatistics("clientName",param);
  // }
//   当填写金额的时候触发的方法
  setMoneyName(param,type) {
    this.props.businessStores.changeStatistics("unitPrice",param);
  }
  //   当填写时长的时候触发的方法
  setLengthName(param,type) {
    this.props.businessStores.changeStatistics("length",param);
  }
  //   当选择业务类型的时候触发的方法
  setBusinessTypeName(param,type) {
    let codeValue = {
      1: "租用主机",
      2: "托管主机",
      3: "租用机柜"
    };
    this.props.businessStores.changeStatistics("businessType",codeValue[param.business_type.value]);
  }
  //   当填写机器编号的时候触发的方法
  setMachineNumberName(param,type) {
    // console.log(param);
    this.props.businessStores.changeStatistics("productName",param);
  }
//   更新业务时执行的函数
  updata() {
    this.getCustomerInfo(qs.parse(location.search.substr(1)).id);
    this.props.businessStores.getData(qs.parse(location.search.substr(1)).id,this.state.value);
  }
//   查询业务
  handleChange = (value) => {
        this.props.businessStores.getData(qs.parse(location.search.substr(1)).id,value);
        // this.props.businessStores.findData({
        //     business_status: value
        // });
        this.setState({ value });
    }
    //   添加业务
  addData = (param,callbrak) => {
    param.client_id = qs.parse(location.search.substr(1)).id;
    param.resource_detail = JSON.stringify(param.machine_number);
    param.machine_number = param.machine_number.id;
    this.props.businessStores.addData(param).then((state) => {
      callbrak(state);
    });
  }
//   删除业务
  delData = (selectedData,callbrak) => {
    const {businessStores} = this.props;
    let delIng = selectedData.map(item => businessStores.delData(item));
    callbrak(delIng);
  }
//   过滤业务
  filterData = (param) => {
    const {businessStores} = this.props;
    businessStores.filterData(param);
  }
// 获取客户信息
  getCustomerInfo = (id) => {
    get("business/admin_customer",{
        id
    }).then((res) => {
        if(res.data.code==1) {
            this.setState({
                customerInfo: {
                    id: res.data.data.find(item => item.id == id).id,
                    nickname: res.data.data.find(item => item.id == id).nickname,
                    money: res.data.data.find(item => item.id == id).money,
                    status: res.data.data.find(item => item.id == id).status,
                    clerk_name: res.data.data.find(item => item.id == id).clerk_name
                }
            });
        }
    });
  }
/**
 * 渲染方法
 * @class ListTableComponent 这个是渲染一个table组件
 * @class TabComponent 这个是渲染一个tab选择栏
 */
  render() {
      const {classes} = this.props;
      const { customerInfo } = this.state;
    return (
        <TabComponent onChange={this.handleChange} type={this.state.value} types={[
            {
                label: "租用主机",
                value: 1
            },
            {
                label: "托管主机",
                value: 2
            },
            {
                label: "租用机柜",
                value: 3
            }
        ]}>
             <ListTableComponent
                title={`客户账号：${customerInfo.nickname}&nbsp;&nbsp;&nbsp;&nbsp;客户余额：${customerInfo.money}&nbsp;&nbsp;&nbsp;&nbsp;客户账号状态：${customerInfo.status}&nbsp;&nbsp;&nbsp;&nbsp;业务员：${customerInfo.clerk_name}`}
                operatBtns={[<ManualRecharge postUrl="business/recharge" nameParam="email" {...customerInfo} buttonEl={(open) => (<Button variant="contained" onClick={open} color="primary">
                充值
                </Button>)} />,<OtherConsumption {...customerInfo} />]}
                operattext="业务信息"
                listFilterComponentClassName={classes.listFilterComponent}
                className={classes.listTableComponent}
                inputType={inputType}
                filterType={filterType}
                headTitlesData={columnData}
                data={this.props.businessStores.business}
                currentStores={this.props.businessStores}
                addData={this.addData.bind(this)}
                updata={this.updata.bind(this)}
                delData={this.delData.bind(this)}
                filterData={this.filterData.bind(this)}
                detailPanel={(data,column) => (
                    <Machine data={data} headTitlesData={column} />
                )}
                tableRowStyle={data => {
                    let endTime = Math.round(new Date(data.endding_time).getTime()/1000);
                    let nowTime = Math.round(new Date().getTime()/1000);
                    return {
                        classes: {
                            root: classNames({
                                [classes.fastExpired]:  (endTime > nowTime && (endTime - nowTime) < 60*60*24*3),
                                [classes.expired]: endTime < nowTime
                            }),
                            hover: classes.tableHover
                        }
                    };
                }}
            />
        </TabComponent>
    );
  }
}
BusinesList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(BusinesList);
