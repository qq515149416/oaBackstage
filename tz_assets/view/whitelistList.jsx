import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
// import Paper from '@material-ui/core/Paper';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
import {post} from "../tool/http.js";
import InputExpansionComponent from "../component/inputExpansionComponent.jsx";
import TabComponent from "../component/tabComponent.jsx";
import UploadExcelComponent from "../component/uploadExcelComponent.jsx";

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
const columnData = [
    { id: 'binding_machine', numeric: true, disablePadding: false, label: '机器编号' },
    { id: 'customer_name', numeric: true, disablePadding: false, label: '客户名字' },
    { id: 'white_ip', numeric: true, disablePadding: false, label: 'IP' },
    { id: 'domain_name', numeric: true, disablePadding: false, label: '绑定域名', render: (h,param) => {
        return h((
            <a target="_blank" rel="noreferrer" href={`/tz_admin/whitelist/skipBeian?domain=${param}`}>
                {param}
            </a>
        ));
    } },
    { id: 'record_number', numeric: true, disablePadding: false, label: '备案编号' },
    { id: 'status', numeric: true, disablePadding: false, label: '审核状态' },
    { id: 'submit_name', numeric: true, disablePadding: false, label: '提交人' },
    // { id: 'submittran', numeric: true, disablePadding: false, label: '提交方式' },
    // { id: 'white_number', numeric: true, disablePadding: false, label: '业务编号' },
    { id: 'operat', numeric: true, disablePadding: false, extend: true, extendData: [
        {id: "check_number", label: "审核人员工号", type: "text"},
        {id: "check_time", label: "审核时间" ,type: "text"},
        {id: "check_note", label: "审核备注" ,type: "text"},
        {id: "submit_note", label: "提交备注" ,type: "text"},
        {id: "submittran", label: "提交方式" ,type: "text"},
        {id: "white_number", label: "业务编号" ,type: "text"},
    ],extendConfirm: {
        rule: {
            term: "white_status",
            execute: 0,
            type: "equal"
        },
        title: "更改审核状态操作",
        content: "是否要更改此审核状态",
        select: true,
        input: [
            {
                id: "note",
                label: "备注",
                param: "note"
            },
            {
                id: "record_number",
                label: "备案编号",
                param: "record_number"
            }
        ],
        selectOptions: [
            {
                text: "审核通过",
                value: 1
            },
            {
                text: "审核不通过",
                value: 2,
                default: true
            },
            {
                text: "黑名单",
                value: 3
            }
        ],
        ok: (data,param) => {
            return new Promise((resolve,reject) => {
                post("whitelist/check",{
                    white_status: param,
                    id: data.id,
                    check_note: data.note,
                    record_number: data.record_number,
                    method: "checkWhiteList"
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
    },label: '操作'
    }
];
const inputType = [
    {
        field: "white_ip",
        label: "IP",
        type: "text"
    },
    {
        field: "domain_name",
        label: "域名",
        type: "text",
        model: {
            getSubordinateData: (value,callbrak) => {
                let reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
                if((!reg.test(value)) || value.indexOf("www") > -1) {
                    callbrak("domain_name.error",true);
                    callbrak("domain_name.helperText","域名不能携带http和www");
                } else {
                    callbrak("domain_name.error",false);
                    callbrak("domain_name.helperText","");
                }
            }
        }
    },
    {
        field: "record_number",
        label: "备案编号",
        type: "text"
    },
    {
        field: "submit_note",
        label: "备注",
        type: "text"
    },
    {
        field: "extentParam",
        label: "",
        type: "component",
        Component: InputExpansionComponent
    }
];
/**
 * @var filterType 搜索数据时对应字段的输入组件
 */
const filterType = [
];
@inject("whitelistsStores")
@observer
class WhitelistList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }
    componentDidMount() {
        this.props.whitelistsStores.getData({
            white_status: this.state.value
        });
        inputType[inputType.findIndex(item => item.field=="white_ip")].model = {
            getSubordinateData: this.getIpData.bind(this)
        };
    }
    updata() {
        this.props.whitelistsStores.getData({
            white_status: this.state.value
        });
    }
    getIpData = (value) => {
        this.props.whitelistsStores.getIpParam(value);
    }
    addData = (param,callbrak) => {
        // console.log(param);
        this.props.whitelistsStores.addData(param).then(state => {
            callbrak(state);
        });
    }
    delData = (selectedData,callbrak) => {
        const {whitelistsStores} = this.props;
        let delIng = selectedData.map(item => whitelistsStores.delData(item));
        callbrak(delIng);
    }
    handleChange = (value) => {
        this.props.whitelistsStores.getData({
            white_status: value
        });
        this.props.whitelistsStores.type = value;
        this.setState({ value });
    }
    /*
        <Paper square>
                <Tabs
                value={this.state.value}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleChange}
                >
                <Tab label="审核中" value={0} />
                <Tab label="审核通过" value={1} />
                <Tab label="审核不通过" value={2} />
                <Tab label="黑名单" value={3} />
                <Tab label="取消" value={4} />
                </Tabs>
            </Paper>

    */
    //   批量审核
    checkAll(selectedData,callbrak) {
        const {whitelistsStores} = this.props;
        let delIng = selectedData.map(item => whitelistsStores.checkAll({
            ...item,
            white_status: item.business_status
        }));
        callbrak(delIng);
    }
    //   过滤充值记录
   filterData = (param) => {
    const {whitelistsStores} = this.props;
    whitelistsStores.filterData(param);
  }
    render() {
        const {classes} = this.props;
        return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
                {
                    label: "审核中",
                    value: 0
                },
                {
                    label: "审核通过",
                    value: 1
                },
                {
                    label: "审核不通过",
                    value: 2
                },
                {
                    label: "黑名单",
                    value: 3
                },
                {
                    label: "取消",
                    value: 4
                }
            ]}>
                <ListTableComponent
                    className={classes.listTableComponent}
                    listFilterComponentClassName={classes.listFilterComponent}
                    title="白名单"
                    operattext="白名单操作"
                    inputType={inputType}
                    headTitlesData={columnData}
                    filterType={filterType}
                    data={this.props.whitelistsStores.whitelists}
                    currentStores={this.props.whitelistsStores}
                    addData={this.addData.bind(this)}
                    delData={this.delData.bind(this)}
                    updata={this.updata.bind(this)}
                    checkAll={this.checkAll.bind(this)}
                    filterData={this.filterData.bind(this)}
                    customizeToolbar={<UploadExcelComponent getExcel="/tz_admin/whitelist/excelTemplate" postExcel="whitelist/handleExcel" />}
                    checkSelectOptions={[
                        {
                            text: "审核通过",
                            value: 1,
                            default: true
                        },
                        {
                            text: "审核不通过",
                            value: 2
                        },
                        {
                            text: "黑名单",
                            value: 3
                        }
                    ]}
                />
            </TabComponent>
        );
      }
}
WhitelistList.propTypes = {
    classes: PropTypes.object.isRequired,
};
const WhitelistListComponent = (props) => {
    return <WhitelistList {...props} />
}
export default withStyles(styles)(WhitelistListComponent);
