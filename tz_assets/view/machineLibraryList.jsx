import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
// import Paper from '@material-ui/core/Paper';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
import UploadExcelComponent from "../component/uploadExcelComponent.jsx";
import TabComponent from "../component/tabComponent.jsx";
import AddBusiness from "../component/dialog/addBusiness.jsx";
import FilterSelect from "../component/utensil/filterSelect.jsx";
import { get, post } from "../tool/http";

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
let columnData = [
    { id: 'machine_num', numeric: true, disablePadding: true, label: '机器编号' },
    { id: 'nickname', numeric: true, disablePadding: true, label: '客户' },
    { id: 'name', numeric: true, disablePadding: true, label: '业务员' },
    { id: 'cpu', numeric: true, disablePadding: true, label: 'CPU' },
    { id: 'memory', numeric: true, disablePadding: true, label: '内存' },
    { id: 'harddisk', numeric: true, disablePadding: true, label: '硬盘' },
    { id: 'machineroom_name', numeric: true, disablePadding: true, label: '机房' },
    { id: 'cabinets', numeric: true, disablePadding: true, label: '机柜编号' },
    { id: 'ip', numeric: true, disablePadding: true, label: 'IP' },
    { id: 'bandwidth', numeric: true, disablePadding: true, label: '带宽(M)' },
    { id: 'protect', numeric: true, disablePadding: true, label: '防护(G)' },
    { id: 'used', numeric: true, disablePadding: true, label: '使用状态' },
    { id: 'status', numeric: true, disablePadding: true, label: '机器状态' },
    { id: 'operat', numeric: true, disablePadding: false, extend: true, extendData: [
        {id: "loginname", label: "登陆名", type: "text"},
        {id: "loginpass", label: "登录密码", type: "text"},
        {id: "machine_type", label: "机器型号" ,type: "text"},
        {id: "own_business", label: "所属业务编号" ,type: "text"},
        {id: "business_end", label: "业务到期时间" ,type: "text"},
        {id: "business", label: "业务类型" ,type: "text"},
        {id: "machine_note", label: "备注" ,type: "text"}
    ], label: '操作',extendElement: (data) => {
        return (
            <AddBusiness {...data} />
        )
}}
];
let columnDataFull = [
    { id: 'machine_num', numeric: true, disablePadding: true, label: '机器编号' },
    { id: 'nickname', numeric: true, disablePadding: true, label: '客户' },
    { id: 'name', numeric: true, disablePadding: true, label: '业务员' },
    { id: 'cpu', numeric: true, disablePadding: true, label: 'CPU' },
    { id: 'memory', numeric: true, disablePadding: true, label: '内存' },
    { id: 'harddisk', numeric: true, disablePadding: true, label: '硬盘' },
    { id: 'machineroom_name', numeric: true, disablePadding: true, label: '机房' },
    { id: 'cabinets', numeric: true, disablePadding: true, label: '机柜编号' },
    { id: 'ip', numeric: true, disablePadding: true, label: 'IP' },
    { id: 'bandwidth', numeric: true, disablePadding: true, label: '带宽(M)' },
    { id: 'protect', numeric: true, disablePadding: true, label: '防护(G)' },
    { id: 'used', numeric: true, disablePadding: true, label: '使用状态' },
    { id: 'status', numeric: true, disablePadding: true, label: '机器状态' },
    { id: 'operat', numeric: true, disablePadding: false, extend: true, extendData: [
        {id: "loginname", label: "登陆名", type: "text"},
        {id: "loginpass", label: "登录密码", type: "text"},
        {id: "machine_type", label: "机器型号" ,type: "text"},
        {id: "own_business", label: "所属业务编号" ,type: "text"},
        {id: "business_end", label: "业务到期时间" ,type: "text"},
        {id: "business", label: "业务类型" ,type: "text"},
        {id: "machine_note", label: "备注" ,type: "text"}
    ], label: '操作',extendElement: (data) => {
        return (
            <AddBusiness {...data} />
        )
} }
];
const inputType = [
    {
        field: "machine_num",
        label: "机器编号",
        type: "text"
    },
    {
        field: "cpu",
        label: "CPU",
        type: "text"
    },
    {
        field: "memory",
        label: "内存",
        type: "text"
    },
    {
        field: "harddisk",
        label: "硬盘",
        type: "text"
    },
    {
        field: "machineroom",
        label: "选择机房",
        type: "select",
        defaultData: []
    },
    {
        field: "cabinet",
        label: "选择机柜",
        type: "select",
        defaultData: [],
        rule: {
            clear: "add"
        }
    },
    {
        field: "ip_company",
        label: "选择运营商",
        type: "switch",
        radioData: [
            {
                checked: true,
                value: "0",
                label: "电信公司"
            },
            {
                checked: false,
                value: "1",
                label: "移动公司"
            },
            {
                checked: false,
                value: "2",
                label: "联通公司"
            }
        ]
    },
    {
        field: "ip_id",
        label: "选择IP",
        type: "select",
        defaultData: [],
        rule: {
            clear: "add"
        }
    },
    {
        field: "bandwidth",
        label: "带宽(M)",
        type: "text"
    },
    {
        field: "protect",
        label: "防护(G)",
        type: "text"
    },
    {
        field: "loginname",
        label: "登陆名",
        type: "text"
    },
    {
        field: "loginpass",
        label: "登录密码",
        type: "text"
    },
    {
        field: "machine_type",
        label: "机器型号",
        type: "text"
    },
    {
        group: "root",
        field: "business_type",
        label: "业务类型",
        type: "switch",
        radioData: [
            {
                checked: true,
                value: "1",
                label: "租用"
            },
            {
                checked: false,
                value: "2",
                label: "托管"
            },
            {
                checked: false,
                value: "3",
                label: "预备机器"
            },
            {
                checked: false,
                value: "4",
                label: "托管预备机器"
            }
        ]
    },
    {
        group: "2,4",
        field: "sales_id",
        label: "业务员",
        type: "component",
        defaultData: [],
        Component: props => (
            <FilterSelect
                placeholder="(请选择选项方可提交)"
                suggestions={props.data}
                onChange={props.setComponentParam}
          />
        )
    },
    {
        group: "2,4",
        field: "customer_id",
        label: "客户",
        type: "component",
        defaultData: [],
        Component: props => {
            if(props.editData) {
                if(props.editData.customer_id) {
                    props.setComponentParam({
                        id: props.editData.customer_id,
                        name: props.editData.nickname
                    });
                }
            }
            return (
                <FilterSelect
                    value={props.editData ? props.editData.nickname : null}
                    placeholder="(请选择选项方可提交)"
                    suggestions={props.data}
                    onChange={props.setComponentParam}
              />
            );
        }
    },
    {
        field: "used_status",
        label: "使用状态",
        type: "switch",
        radioData: [
            {
                checked: true,
                value: "0",
                label: "未使用"
            },
            {
                checked: false,
                value: "1",
                label: "业务锁定"
            },
            {
                checked: false,
                value: "2",
                label: "使用中"
            },
            {
                checked: false,
                value: "3",
                label: "锁定使用"
            },
            {
                checked: false,
                value: "4",
                label: "迁移"
            }
        ]
    },
    {
        field: "machine_status",
        label: "机器状态",
        type: "switch",
        radioData: [
            {
                checked: true,
                value: "0",
                label: "上架"
            },
            {
                checked: false,
                value: "1",
                label: "下架"
            }
        ]
    },
    {
        field: "machine_note",
        label: "备注",
        type: "text"
    }
];
const filterType = [
  ];
@inject("machineLibrarysStores")
@observer
class MachineLibraryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1,
            customers: [],
            sales: [],
            customer_error: {}
        };
    }
    componentDidMount() {
        const { value } = this.state;
        if(value > 2) {
            columnData = [...columnData.filter(item => {
                if(item.id!="cabinets"&&item.id!="ip") {
                    return item;
                }
            })]
        } else {
            columnData = [...columnDataFull];
        }

        get('business/select_sales').then((res) => {
            if (res.data.code === 1) {
                this.setState({
                    sales: res.data.data
                })
            } else {
                alert(res.data.msg);
            }
        }).catch(error => {
            console.log(error);
            alert('获取该业务员名下的客户列表失败！');
        });

        inputType[inputType.findIndex(item => item.field=="sales_id")].Component = props => {
            if(props.editData && this.state.customers.length===0 && (!this.state.customer_error[props.editData.id])) {
                post('business/select_users', {
                    salesman_id: props.editData.admin_id
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.setState(state => {
                            state.customers = res.data.data;
                            state.customer_error[props.editData.id] = res.data.data.length === 0 ? true : false;
                            return state;
                        });
                    } else {
                        this.setState(state => {
                            state.customer_error[props.editData.id] = true;
                            return state;
                        });
                        alert(res.data.msg);
                    }
                }).catch(error => {
                    console.log(error);
                    this.setState(state => {
                        state.customer_error[props.editData.id] = true;
                        return state;
                    });
                    alert('获取该业务员名下的客户列表失败！');
                });
            }
            return (
                <FilterSelect
                    value={props.editData ? props.editData.name : null}
                    placeholder="(请选择选项方可提交)"
                    suggestions={props.data}
                    onChange={(item) => {
                        // 根据业务员的id获取客户列表
                        post('business/select_users', {
                            salesman_id: item.id
                        }).then((res) => {
                            if (res.data.code === 1) {
                            this.setState({
                                customers: res.data.data
                            })
                            } else {
                                alert(res.data.msg);
                            }
                        }).catch(error => {
                            console.log(error);
                            alert('获取该业务员名下的客户列表失败！');
                        });
                        props.setComponentParam(item);
                    }}
              />
            );
        };

        this.props.machineLibrarysStores.getData();
        inputType[inputType.findIndex(item => item.field=="machineroom")].model = {
            getSubordinateData: this.getCabinetData.bind(this)
        };
        inputType[inputType.findIndex(item => item.field=="cabinet")].model = {
            editGetSubordinateData: this.getCabinetData.bind(this)
        };
        inputType[inputType.findIndex(item => item.field=="ip_id")].model = {
            editGetSubordinateData: this.getIpsData.bind(this)
        };
        inputType[inputType.findIndex(item => item.field=="ip_company")].model = {
            getSubordinateData: this.getIpsData.bind(this)
        };
    }
    changeData = (param,callbrak) => {
        const {machineLibrarysStores} = this.props;
        if(param.customer_id) {
            param.customer_id = param.customer_id.id;
        }
        machineLibrarysStores.changeData(param).then((state) => {
          callbrak(state);
        });
      }
    delData = (selectedData,callbrak) => {
        const {machineLibrarysStores} = this.props;
        let delIng = selectedData.map(item => machineLibrarysStores.delData(item));
        callbrak(delIng);
    }
    addData = (param,callbrak) => {
        // console.log(param);
        if(param.customer_id) {
            param.customer_id = param.customer_id.id;
        }
        this.props.machineLibrarysStores.addData(param).then((state) => {
          callbrak(state);
        });
      }
    getCabinetData(param,type) {
        if(param.machineroom) {
            this.props.machineLibrarysStores.getCabinetsData({
                roomid: param.machineroom.value,
                type
            });
        }
        if(param.machineroom&&param.ip_company) {
            if(type=="edit") {
                this.props.machineLibrarysStores.getIpsData({
                    roomid: param.machineroom.value,
                    ip_company: param.ip_company.value,
                    type,
                    id: param.ip_id.value
                });
            } else {
                this.props.machineLibrarysStores.getIpsData({
                    roomid: param.machineroom.value,
                    ip_company: param.ip_company.value,
                    type
                });
            }

        }
    }
    getIpsData(param,type) {
        if(param.machineroom&&param.ip_company) {
            if(type=="edit") {
                this.props.machineLibrarysStores.getIpsData({
                    roomid: param.machineroom.value,
                    ip_company: param.ip_company.value,
                    type,
                    id: param.ip_id.value
                });
            } else {
                this.props.machineLibrarysStores.getIpsData({
                    roomid: param.machineroom.value,
                    ip_company: param.ip_company.value,
                    type
                });
            }

        }
    }
    filterData = (param) => {
        const {machineLibrarysStores} = this.props;
        machineLibrarysStores.filterData(param);
    }
    handleChange = (value) => {
        // columnData
        if(value > 2) {
            columnData = [...columnData.filter(item => {
                if(item.id!="cabinets"&&item.id!="ip") {
                    return item;
                }
            })]
        } else {
            columnData = [...columnDataFull];
        }
        this.props.machineLibrarysStores.switchType(value);
        this.setState({ value });
        this.props.machineLibrarysStores.getData();
    }
    render() {
        const {classes} = this.props;
        inputType[inputType.findIndex(item => item.field=="sales_id")].defaultData = this.state.sales;
        inputType[inputType.findIndex(item => item.field=="customer_id")].defaultData = this.state.customers.map(item => {
            if(!item._name) {
                item._name = "账号："+(item.name || "");
                item._name += " 邮箱：" + (item.email || "");
                item._name += " 昵称：" + (item.nickname || "");
                item.name = item._name;
            }
            return item;
        });
        inputType[inputType.findIndex(item => item.field=="machineroom")].defaultData = this.props.machineLibrarysStores.comprooms.map(item => {
            return {
              value: item.roomid,
              text: item.machine_room_name
            }
        });
        if(inputType[inputType.findIndex(item => item.field=="machineroom")].defaultData.length != undefined) {
            inputType[inputType.findIndex(item => item.field=="machineroom")].defaultData.unshift({
                value: 0,
                text: "暂无机房"
            });
        }
        inputType[inputType.findIndex(item => item.field=="cabinet")].defaultData = this.props.machineLibrarysStores.cabinets.map(item => {
            return {
              value: item.cabinetid,
              text: item.cabinet_id
            }
        });
        if(inputType[inputType.findIndex(item => item.field=="cabinet")].defaultData.length != undefined) {
            inputType[inputType.findIndex(item => item.field=="cabinet")].defaultData.unshift({
                value: 0,
                text: "暂无机柜"
            });
        }
        inputType[inputType.findIndex(item => item.field=="ip_id")].defaultData = this.props.machineLibrarysStores.ips.map(item => {
            return {
              value: item.ipid,
              text: item.ip
            }
        })
        if(inputType[inputType.findIndex(item => item.field=="ip_id")].defaultData.length != undefined) {
            inputType[inputType.findIndex(item => item.field=="ip_id")].defaultData.unshift({
                value: 0,
                text: "暂无IP"
            });
        }
        /*
            <Paper square>
                <Tabs
                value={this.state.value}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleChange}
                >
                <Tab label="租用" value={1} />
                <Tab label="托管" value={2} />
                <Tab label="备用" value={3} />
                </Tabs>
                </Paper>

        */
        return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
                {
                    label: "租用",
                    value: 1
                },
                {
                    label: "托管",
                    value: 2
                },
                {
                    label: "预备机器",
                    value: 3
                },
                {
                    label: "托管预备机器",
                    value: 4
                }
            ]}>
                 <ListTableComponent
            className={classes.listTableComponent}
            listFilterComponentClassName={classes.listFilterComponent}
            title="机器库"
            operattext="机器资源"
            inputType={inputType}
            filterType={filterType}
            headTitlesData={columnData.filter(item => {
                if(this.state.value!=2 && this.state.value!=4) {
                    if(item.id!="nickname"&&item.id!="name") {
                        return item;
                    }
                } else {
                    return item;
                }
            })}
            data={this.props.machineLibrarysStores.machineLibrarys}
            currentStores={this.props.machineLibrarysStores}
            addData={this.addData.bind(this)}
            delData={this.delData.bind(this)}
            changeData={this.changeData.bind(this)}
            filterData={this.filterData.bind(this)}
            customizeToolbar={<UploadExcelComponent getExcel="/tz_admin/machine/excel_template" postExcel="machine/handle_excel" />}
          />
            </TabComponent>
        );
      }
}
MachineLibraryList.propTypes = {
    classes: PropTypes.object.isRequired,
};
const MachineLibraryListComponent = (props) => {
    return <MachineLibraryList {...props} />
}
export default withStyles(styles)(MachineLibraryListComponent);
