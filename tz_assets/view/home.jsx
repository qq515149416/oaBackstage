import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {get} from "../tool/http";
import TabComponent from "../component/tabComponent.jsx";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import CircularProgress from '@material-ui/core/CircularProgress';

const qs = require('qs');

const styles = theme => ({
    root: {
      width: '100%',
    //   marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
      marginTop: 0,
      borderRadius: "0 0 4px 4px",
      boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    },
    table: {
      minWidth: 700
    },
    fontStyle: {
        fontSize: "14px"
    },
    td: {
        paddingLeft: 0,
        paddingRight: 0,
        textAlign: "center"
      }
});

const types = {
    overdueCabinet: {
        url: "overdue/showOverdueCabinet",
        columnData: [
            { id: 'business_number', label: '业务编号' },
            { id: 'cabinet_number', label: '机柜编号' },
            { id: 'client_name', label: '客户名称' },
            { id: 'nickname', label: '客户昵称' },
            { id: 'endding_time', label: '到期时间' },
            { id: 'machine_room_name', label: '所属机房' }
        ]
    },
    overdueMachine: {
        url: "overdue/showOverdueMachine",
        columnData: [
            { id: 'business_number', label: '业务编号' },
            { id: 'machine_number', label: '机器编号' },
            { id: 'client_name', label: '客户名称' },
            { id: 'nickname', label: '客户昵称' },
            { id: 'endding_time', label: '到期时间' },
            { id: 'ip', label: 'IP地址' }
        ]
    },
    overdueRes: {
         url: "overdue/showOverdueRes",
         columnData: [
            { id: 'business_number', label: '业务编号' },
            { id: 'cabinet_num', label: '机柜编号' },
            { id: 'machine_num', label: '机器编号' },
            { id: 'customer_name', label: '客户名称' },
            { id: 'nickname', label: '客户昵称' },
            { id: 'endding_time', label: '到期时间' },
            { id: 'resource_type', label: '资源类型' },
            { id: 'self_number', label: '自身编号' }
        ]
    },
    unpaidMachine: {
        url: "overdue/showUnpaidMachine",
        columnData: [
            { id: 'business_number', label: '业务编号' },
            { id: 'machine_number', label: '机器编号' },
            { id: 'client_name', label: '客户名称' },
            { id: 'nickname', label: '客户昵称' },
            { id: 'endding_time', label: '到期时间' },
            { id: 'ip', label: 'ip地址' },
            { id: 'start_time', label: '启用时间' }
        ]
    },
    xiaJiaMachine: {
        url: "overdue/showXiaJiaMachine",
        columnData: [
            { id: 'business_number', label: '业务编号' },
            { id: 'machine_number', label: '机器编号' },
            { id: 'client_name', label: '客户名称' },
            { id: 'nickname', label: '客户昵称' },
            { id: 'endding_time', label: '到期时间' },
            { id: 'ip', label: 'ip地址' },
            { id: 'start_time', label: '启用时间' }
        ]
    },
    unpaidCabinet: {
        url: "overdue/showUnpaidCabinet",
        columnData: [
            { id: 'business_number', label: '业务编号' },
            { id: 'cabinet_number', label: '机柜编号' },
            { id: 'client_name', label: '客户名称' },
            { id: 'nickname', label: '客户昵称' },
            { id: 'endding_time', label: '到期时间' },
            { id: 'machine_room_name', label: '所属机房' },
            { id: 'start_time', label: '启用时间' }
        ]
    },
    xiaJiaRes: {
        url: "overdue/showXiaJiaRes",
        columnData: [
            { id: 'business_number', label: '业务编号' },
            { id: 'cabinet_num', label: '机柜编号' },
            { id: 'machine_num', label: '机器编号' },
            { id: 'customer_name', label: '客户名称' },
            { id: 'nickname', label: '客户昵称' },
            { id: 'endding_time', label: '到期时间' },
            { id: 'resource_type', label: '资源类型' },
            { id: 'self_number', label: '自身编号' }
        ]
    },
    trialDefenseIp: {
        url: "overdue/showTrialDefenseIp",
        columnData: [
            { id: 'business_number', label: '业务编号' },
            { id: 'nickname', label: '所属客户' },
            { id: 'price', label: '单月价格' },
            { id: 'status', label: '使用状态' }
        ]
    },
    unpaidIdcOrder: {
        url: "overdue/showUnpaidIdcOrder",
        columnData: [
            { id: 'business_sn', label: '业务编号' },
            { id: 'customer_name', label: '客户名称' },
            { id: 'nickname', label: '客户昵称' },
            { id: 'duration', label: '购买时长' },
            { id: 'endding_time', label: '到期时间' },
            { id: 'resource_type', label: '资源类型' },
            // { id: 'order_type', label: '订单类型' },
            { id: 'payable_money', label: '应付金额' },
            { id: 'price', label: '单价' }
        ]
    },
    overdueResDet: {
        url: "overdue/showOverdueResDet",
        subOption: [
            {value: 4, label: 'IP', default: true},
            {value: 5, label: 'CPU', default: false},
            {value: 6, label: '硬盘', default: false},
            {value: 7, label: '内存', default: false},
            {value: 8, label: '带宽', default: false},
            {value: 9, label: '防护', default: false},
            {value: 10, label: 'CDN', default: false}
        ],
        columnData: [
            { id: 'business_number', label: '业务编号' },
            { id: 'cabinet_num', label: '机柜编号' },
            { id: 'machine_num', label: '机器编号' },
            { id: 'customer_name', label: '客户名称' },
            { id: 'nickname', label: '客户昵称' },
            { id: 'endding_time', label: '到期时间' },
            { id: 'resource_type', label: '资源类型' },
            { id: 'self_number', label: '自身编号' }
        ]
    }
};
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "overdueMachine",
            data: [],
            subOption: {},
            loading: true,
            requestState: 1
        };
    }
    componentDidMount() {
        const {type} = this.state;
        setTimeout(() => {
            this.setState({
                loading: false
            });
        },1000*15);
        this.byTypeGetData(type);
    }
    byTypeGetData = (type) => {
        this.setState({
            data: [],
            requestState: 2
        });
        const param={};
        if(types[type].subOption && types[type].subOption.length) {
            param.resource_type = types[type].subOption.find(item => item.default).value;
            this.setState(state => {
                types[type].subOption.forEach(item => {
                    state.subOption[item.value] = item.default;
                });
                return state;
            });
        }
        if(qs.parse(location.search.substr(1)).type && qs.parse(location.search.substr(1)).type==="admin") {
            types[type].url = types[type].url + "X";
        }
        get(types[type].url,param).then(res => {
            if(res.data.code==1) {
                const data = res.data.data;
                data.length && data[0].endding_time && data.sort((a,b) => {
                    const aTime = Math.round(new Date(a.endding_time).getTime()/1000);
                    const bTime = Math.round(new Date(b.endding_time).getTime()/1000);
                    return aTime - bTime;
                })
                this.setState({
                    data: data,
                    requestState: 1
                });
            } else {
                this.setState({
                    requestState: 0
                });
                console.warn(res.data.msg);
            }
        });
    }
    handleChange = (value) => {
        this.byTypeGetData(value);
        this.setState({
            type: value
        });
    }
    handleSubChange = value => event => {
        const {type} = this.state;
        this.setState({
            requestState: 2
        });
        get(types[type].url,{
            resource_type: value
        }).then(res => {
            if(res.data.code==1) {
                // this.setState({
                //     data: res.data.data
                // });
                this.setState(state => {
                    for(let key in state.subOption) {
                        state.subOption[key] = false;
                    }
                    state.subOption[value] = true;
                    state.data = res.data.data;
                    state.requestState = 1;
                    return state;
                });
            } else {
                this.setState({
                    requestState: 0
                });
                // console.warn(res.data.msg);
                alert(res.data.msg);
            }
        });

    };
    render() {
        const { classes } = this.props;
        const {type,data,requestState} = this.state;
        return (
            <TabComponent types={[
                {label: "5天内到期机器", value: "overdueMachine"},
                {label: "5天内到期机柜", value: "overdueCabinet"},
                {label: "5天内到期资源", value: "overdueRes"},
                {label: "未支付使用的机器", value: "unpaidMachine"},
                {label: "最近下架机器", value: "xiaJiaMachine"},
                {label: "未支付使用的机柜", value: "unpaidCabinet"},
                {label: "下架资源", value: "xiaJiaRes"},
                {label: "近过期资源", value: "overdueResDet"},
                {label: "试用高防IP业务", value: "trialDefenseIp"},
                {label: "未付款idc业务", value: "unpaidIdcOrder"}
            ]} type={type} onChange={this.handleChange}>
                <Paper className={classes.root}>
                {
                    (types[type].subOption && types[type].subOption.length) && (
                        <FormGroup row>
                            {
                                types[type].subOption.map(item => (
                                    <FormControlLabel
                                    control={
                                        <Radio
                                            checked={this.state.subOption[item.value]}
                                            onChange={this.handleSubChange(item.value)}
                                            value={item.value}
                                        />
                                    }
                                    label={item.label}
                                    />
                                ))
                            }
                        </FormGroup>
                    )
                }
                <Table className={classes.table}>
                    <TableHead>
                    <TableRow>
                        <TableCell className={classes.fontStyle}>ID</TableCell>
                        {
                            types[type].columnData.map(item => (
                                <TableCell className={classes.fontStyle} numeric>{item.label}</TableCell>
                            ))
                        }
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (requestState == 2) && (
                                <TableRow>
                                    <TableCell className={classes.td} numeric colSpan={types[type].columnData.length}>
                                        <CircularProgress color="secondary" size={50} />
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        {
                            (requestState < 2 && data.length <= 0) && (
                                <TableRow>
                                    <TableCell className={classes.td} numeric colSpan={types[type].columnData.length}>
                                        暂无数据
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    {data.length > 0  &&  data.map(row => {
                        return (
                        <TableRow key={row.id}>
                            <TableCell className={classes.fontStyle} component="th" scope="row">
                                {row.id}
                            </TableCell>
                            {
                                types[type].columnData.map(item => (
                                    <TableCell className={classes.fontStyle} numeric>{row[item.id]}</TableCell>
                                ))
                            }
                        </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </Paper>
            </TabComponent>
        );
    }
}
Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
