import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import TabComponent from "../component/tabComponent.jsx";
import Approval from "../component/icon/approval.jsx";
import {post} from "../tool/http.js";


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
    { id: 'name', numeric: true, disablePadding: false, label: '客户名称' },
    { id: 'api_key', numeric: true, disablePadding: false, label: 'key' },
    { id: 'api_secret', numeric: true, disablePadding: false, label: 'secret' },
    { id: 'state', numeric: true, disablePadding: false, label: '审核状态' },
    { id: 'operat', numeric: true, disablePadding: false, extend: true, extendConfirm: {
        rule: {
            term: "state",
            execute: "审核中",
            type: "equal"
        },
        icon: <Approval />,
        title: "审核操作",
        content: "是否要通过此客户api的审核",
        select: true,
        selectOptions: [
            {
                text: "通过",
                value: 1,
                default: true
            },
            {
                text: "驳回",
                value: 0
            }
        ],
        ok: (data,param) => {
            return new Promise((resolve,reject) => {
                post("api/examine",{
                    apply_id: data.id,
                    examine_res: param
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
        }
    }, label: '操作' }
];

const inputType = [

];

const filterType = [
];

@inject("apisStores")
@observer
class ApiList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 2
        };
    }
    componentDidMount() {
        this.props.apisStores.getData(this.state.value);
    }
    handleChange = (value) => {
        this.props.apisStores.getData(value);
        this.setState({ value });
    }
    updata() {
        this.props.apisStores.getData(this.state.value);
    }
    render() {
        const {classes} = this.props;
        return (
            <TabComponent onChange={this.handleChange} type={this.state.value} types={[
                {
                    label: "不通过",
                    value: 0
                },
                {
                    label: "通过",
                    value: 1
                },
                {
                    label: "审核中",
                    value: 2
                }
            ]}>
                <ListTableComponent
                    className={classes.listTableComponent}
                    listFilterComponentClassName={classes.listFilterComponent}
                    title="api管理"
                    operattext="api操作"
                    inputType={inputType}
                    headTitlesData={columnData}
                    filterType={filterType}
                    data={this.props.apisStores.apis}
                    currentStores={this.props.apisStores}
                    updata={this.updata.bind(this)}
                />
            </TabComponent>
        );
    }
}
ApiList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ApiList);
