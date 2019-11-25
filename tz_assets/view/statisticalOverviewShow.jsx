import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import DehazeIcon from '@material-ui/icons/Dehaze';
import AmountStatisticsChart from '../component/chart/amountStatisticsChart.jsx';
import { inject,observer } from "mobx-react";
import accounting from "accounting";
import classNames from 'classnames';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { get } from "../tool/http";
// import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
const moment = require('moment');

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: "#ebf5fb",
        color: "#3c3c3c",
        fontFamily: "微软雅黑",
        fontSize: "14px",
        fontWeight: "bold",
        paddingLeft: 40,
        paddingRight: 0
    },
    body: {
        fontSize: "14px",
        fontFamily: "微软雅黑",
        fontSize: "14px",
        color: "#666666",
        paddingLeft: 40,
        paddingRight: 0
    },
}))(TableCell);

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#3c3c3c",
        position: "relative",
        paddingLeft: 24,
        margin: 0,
        marginBottom: 14,
        fontFamily: "微软雅黑"
    },
    decoration: {
        position: "absolute",
        left: 0,
        bottom: 2,
        height: 20,
        width: 6,
        backgroundColor: "#0181cb"
    },
    paper: {
        padding: 24,
        paddingBottom: 8,
        paddingTop: 16,
        color: "#666666",
        fontSize: "16px",
        fontFamily: "微软雅黑",
        borderRadius: 6,
        boxShadow: "0 0 7px rgba(107,140,159,.2)",
        cursor: "pointer",
        "&:hover": {
            color: "#fff",
            background: `url(${require("../resource/statistical_bg.png")}) no-repeat`,
            backgroundSize: "100% 100%",
            boxShadow: "0 2px 14px 2px rgba(3,130,204,.4)",
            "& article": {
                color: "#fff"
            },
            "& > header > button": {
                color: "#fff"
            },
            "& .dehazeIcon": {
                background: `url(${require("../resource/menu_icon_2.svg")}) no-repeat center center`
            }
        }
    },
    paperChart: {
        padding: 24,
        paddingBottom: 8,
        paddingTop: 16,
        color: "#666666",
        fontSize: "16px",
        fontFamily: "微软雅黑",
        borderRadius: 6,
        boxShadow: "0 0 7px rgba(107,140,159,.2)"
    },
    paperChartDetail: {
        paddingTop: 30,
        paddingBottom: 0,
        paddingLeft: 35,
        paddingRight: 0
    },
    paperHeader: {
        display: "flex",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 2
    },
    paperArticle: {
        color: "#0181cb",
        fontSize: "36px",
        fontFamily: "Arial",
        fontWeight: "bold",
        marginTop: 5
    },
    icon: {
        // color: "#7d7d7d",
        fontSize: "20px",
        transform: "translateY(2px)"
    },
    iconButton: {
        padding: 8,
        position: "absolute",
        right: -5,
        top: -5,
        "&:hover": {
            borderRadius: 4,
            backgroundColor: "#fff",
            boxShadow: "0 1px 6px 2px rgba(1,72,114,.2)",
            "& > span:first-of-type": {
                color: "#0181cb"
            },
            "& > span:first-of-type .dehazeIcon": {
                background: `url(${require("../resource/menu_icon_3.svg")}) no-repeat center center`
            },
            "&:hover": {
                borderRadius: 4,
                backgroundColor: "#fff",
                "& > span:first-of-type": {
                    color: "#0181cb"
                },
                "& > span:first-of-type .dehazeIcon": {
                    background: `url(${require("../resource/menu_icon_3.svg")}) no-repeat center center`
                }
            }
        }
    },
    iconButtonActive: {
        borderRadius: "4px 4px 0 0",
        backgroundColor: "#fff",
        boxShadow: "0 1px 6px 2px rgba(1,72,114,.2)",
        "& > span:first-of-type": {
            color: "#0181cb"
        },
        "& > span:first-of-type .dehazeIcon": {
            background: `url(${require("../resource/menu_icon_3.svg")}) no-repeat center center`
        },
        "&:hover": {
            borderRadius: "4px 4px 0 0",
            backgroundColor: "#fff",
            "& > span:first-of-type": {
                color: "#0181cb"
            },
            "& > span:first-of-type .dehazeIcon": {
                background: `url(${require("../resource/menu_icon_3.svg")}) no-repeat center center`
            }
        },
        "& .private-popover": {
            display: "block"
        },
        "& .private-mask": {
            display: "block"
        }
    },
    dehazeIcon: {
        width: 18,
        height: 13,
        display: "inline-block",
        background: `url(${require("../resource/menu_icon_1.svg")}) no-repeat center center`
    },
    mask: {
        height: 6,
        // width: "100%",
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff",
        zIndex: 2,
        display: "none"
    },
    popover: {
        display: "none",
        boxShadow: "0 1px 6px 2px rgba(1,72,114,.2)",
        position: "absolute",
        borderRadius: "4px 0 4px 4px",
        backgroundColor: "#fff",
        right: 0,
        top: 28
    },
    popoverList: {
        display: "block",
        minWidth: "6em",
        padding: 8,
        fontSize: "12px",
        fontFamily: "微软雅黑",
        color: "#0181cb",
        position: "relative",
        textAlign: "center",
        textDecoration: "none",
        "&:hover": {
            color: "#0181cb",
            textDecoration: "none"
        }
    },
    link: {
        color: "#7d7d7d",
        fontSize: "12px",
        fontFamily: "微软雅黑",
        textDecoration: "none",
        float: "right",
        fontWeight: "normal",
        transform: "translateY(50%)",
        "&:hover": {
            color: "#0d91dd"
        }
    },
    select: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 14
    },
    dateSelect: {
        width: 478,
    },
    mt10: {
        marginTop: 14
    },
    selectPaper: {
        width: 150,
        height: 40,
        lineHeight: "40px",
        textAlign: "center",
        boxShadow: "0 0 7px rgba(107,140,159,.2)",
        fontFamily: "微软雅黑",
        fontSize: "14px",
        color: "#666666",
        borderRadius: 6,
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#0181cb",
            color: "#fff",
            boxShadow: "0 0 10px rgba(1,129,203,.6)"
        }
    },
    selectPaperHover: {
        backgroundColor: "#0181cb",
        color: "#fff",
        boxShadow: "0 0 10px rgba(1,129,203,.6)"
    },
    dataRoot: {
        marginTop: 14,
        overflowX: "auto",
        boxShadow: "0 0 7px rgba(107,140,159,.2)",
        borderRadius: 6
    },
    dataTable: {

    }
})
@inject("statisticalOverviewStores")
@observer
class StatisticalOverviewShow extends React.Component {
    state = {
        detail: null,
        dateActive: "cm",
        typeActive: "customer",
        popoverState: ""
    }
    componentDidMount() {
        this.props.statisticalOverviewStores.getChartData();
        ["1","2","3"].forEach(item => {
            this.props.statisticalOverviewStores.getData({
                need: item
            });
        });
    }
    formateDate = value => value < 10 ? '0' + value : '' + value
    createDate = (format,calc) => {
        const date = moment();
        if(calc > 0) {
            date.add(calc,"M");
        } else if(calc < 0) {
            date.subtract(Math.abs(calc),"M");
        }
        return date.format(format);
    }
    switchDate = _switch => event => {
        let date = moment();
        const data = this.state.detail;
        const { currentDate } = data;
        if(currentDate) {
            date = currentDate;
        }
        let nowDate = date;
        if(_switch==1) {
            nowDate = date.add(1,"M");
        } else {
            nowDate = date.subtract(1,"M");
        }
        if(moment().isBefore(nowDate)) {
            alert("到底了！");
            return ;
        }
        get(data.url,{
            month: nowDate.format("YYYY-MM")
        }).then(res => {
            if(res.data.code==1) {
                data["date_title"] = nowDate.format("YYYY/MM")+"/01"+" ~ "+nowDate.format("YYYY/MM")+"/"+nowDate.daysInMonth();
                data["data"] = res.data.data;
                data["currentDate"] = nowDate;
                this.setState({
                    detail: data
                });
            }
        });
    }
    handleClick = active => event => {
        this.setState({
            typeActive: active
        });
    }
    toPage = data => event => {
        if(data) {
            const date = moment().format("YYYY-MM");
            get(data.url,{
                month: date
            }).then(res => {
                if(res.data.code==1) {
                    data["data"] = res.data.data;
                    console.log(Object.keys(res.data.data));
                    data["currentDate"] = moment();
                    data["date_title"] = moment().format("YYYY/MM")+"/01"+" ~ "+moment().format("YYYY/MM")+"/"+moment().daysInMonth();
                    // data["data"]["info"] = data["data"]["info"] || [];
                    // data["data"]["line"] = data["data"]["line"] || [];
                    if(data.type=="business") {
                        this.setState({
                            typeActive: "allBusiness"
                        });
                    }
                    this.setState({
                        detail: data
                    });
                }
            });
        } else {
            this.setState({
                detail: data
            });
        }
    }
    customerStatisticsComponent = () => {
        const { classes } = this.props;
        const { title, data, date_title } = this.state.detail;
        // console.log(date_title);
        return (
            <div>
                <Typography className={classes.title} variant="h3" gutterBottom>
                    <span className={classes.decoration}></span>{title}
                </Typography>
                <div className={classes.select}>
                    <div className={classes.dateSelect}>
                        <Grid container spacing={14}>
                            <Grid item xs={4}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: true
                                })} onClick={this.toPage({
                                    title,
                                    type: "customer",
                                    url: "users/getUsersDetailed"
                                })}>
                                    本月
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.selectPaper} onClick={this.switchDate(-1)}>
                                    上一月
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.selectPaper} onClick={this.switchDate(+1)}>
                                    下一月
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                    <Paper onClick={this.toPage(null)} className={classNames(classes.selectPaper,{
                        [classes.selectPaperHover]: true
                    })}>
                        返回
                    </Paper>
                </div>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Paper className={classNames(classes.paperChart,{
                            [classes.paperChartDetail]: true
                        })}>
                            <AmountStatisticsChart
                                position={{
                                    left: "2%",
                                    right: "2%"
                                }}
                                splitNumber={8}
                                title={`${date_title}`}
                                showShadow={true} domId="customer"
                                chartData={data.line.map(item => ({
                                    time: item["time"],
                                    amount: item["num"]
                                }))}
                                width={1224}
                            />
                        </Paper>
                    </Grid>
                </Grid>
                <Paper className={classes.dataRoot}>
                    <Table className={classes.dataTable} aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">用户名</StyledTableCell>
                            <StyledTableCell align="left">昵称</StyledTableCell>
                            <StyledTableCell align="left">用户邮箱</StyledTableCell>
                            <StyledTableCell align="left">电话</StyledTableCell>
                            <StyledTableCell align="left">QQ</StyledTableCell>
                            <StyledTableCell align="left">所属业务员</StyledTableCell>
                            <StyledTableCell align="left">注册时间</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.info.map(item => (
                                    <TableRow>
                                        <StyledTableCell align="left">
                                            {item["name"]}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {item["nickname"]}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {item["email"]}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {item["msg_phone"]}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {item["msg_qq"]}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {item["salesman_name"]}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {item["created_at"]}
                                        </StyledTableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
    rechargeStatisticsComponent = () => {
        const { classes } = this.props;
        const { title, data, date_title } = this.state.detail;
        return (
            <div>
                <Typography className={classes.title} variant="h3" gutterBottom>
                    <span className={classes.decoration}></span>{title}
                </Typography>
                <div className={classes.select}>
                    <div className={classes.dateSelect}>
                        <Grid container spacing={14}>
                            <Grid item xs={4}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: true
                                })} onClick={this.toPage({
                                    title,
                                    type: "recharge",
                                    url: "rechargeStatistics/getRechargeDetailed"
                                })}>
                                    本月
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.selectPaper} onClick={this.switchDate(-1)}>
                                    上一月
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.selectPaper} onClick={this.switchDate(+1)}>
                                    下一月
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                    <Paper onClick={this.toPage(null)} className={classNames(classes.selectPaper,{
                        [classes.selectPaperHover]: true
                    })}>
                        返回
                    </Paper>
                </div>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Paper className={classNames(classes.paperChart,{
                            [classes.paperChartDetail]: true
                        })}>
                            <AmountStatisticsChart
                                position={{
                                    left: "5%",
                                    right: "2%"
                                }}
                                splitNumber={8}
                                title={`${date_title}`}
                                showShadow={true} domId="rechargeStatistics"
                                chartData={data.line.map(item => ({
                                    time: item["time"],
                                    amount: item["recharge_amount"]
                                }))}
                                width={1224}
                            />
                        </Paper>
                    </Grid>
                </Grid>
                <div className={classNames(classes.select,{
                    [classes.mt10]: true
                })}>
                    <div className={classes.dateSelect}>
                        <Grid container spacing={14}>
                            <Grid item xs={4}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: this.state.typeActive == "salesman"
                                })} onClick={this.handleClick("salesman")}>
                                    业务员
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: this.state.typeActive == "customer"
                                })} onClick={this.handleClick("customer")}>
                                    客户
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </div>
                {
                    this.state.typeActive == "salesman" ? (
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Paper className={classes.dataRoot}>
                                    <Table className={classes.dataTable} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">业务员</StyledTableCell>
                                                <StyledTableCell align="left">所属客户充值金额</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.salesman_sta.filter((item,index) => index % 3 == 0).map(item => (
                                                    <TableRow>
                                                        <StyledTableCell align="left">
                                                            {item["name"]}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            {item["recharge_amount"]}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.dataRoot}>
                                    <Table className={classes.dataTable} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">业务员</StyledTableCell>
                                                <StyledTableCell align="left">所属客户充值金额</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.salesman_sta.filter((item,index) => (index+2) % 3 == 0).map(item => (
                                                    <TableRow>
                                                        <StyledTableCell align="left">
                                                            {item["name"]}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            {item["recharge_amount"]}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.dataRoot}>
                                    <Table className={classes.dataTable} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">业务员</StyledTableCell>
                                                <StyledTableCell align="left">所属客户充值金额</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.salesman_sta.filter((item,index) => (index+1) % 3 == 0).map(item => (
                                                    <TableRow>
                                                        <StyledTableCell align="left">
                                                            {item["name"]}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            {item["recharge_amount"]}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                        </Grid>
                    ) : (
                        <Paper className={classes.dataRoot}>
                            <Table className={classes.dataTable} aria-label="customized table">
                                <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left">客户</StyledTableCell>
                                    <StyledTableCell align="left">充值人</StyledTableCell>
                                    <StyledTableCell align="left">充值金额</StyledTableCell>
                                    <StyledTableCell align="left">税额</StyledTableCell>
                                    <StyledTableCell align="left">充值方式</StyledTableCell>
                                    <StyledTableCell align="left">到账银行</StyledTableCell>
                                    <StyledTableCell align="left">充值时间</StyledTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.flow.map(item => (
                                            <TableRow>
                                                <StyledTableCell align="left">
                                                    {item["customer_name"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["recharge_man"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["recharge_amount"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["tax"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["recharge_way"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["bank"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["timestamp"]}
                                                </StyledTableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    )
                }
            </div>
        );
    }
    consumptionStatisticsComponent = () => {
        const { classes } = this.props;
        const { title, data, date_title } = this.state.detail;
        return (
            <div>
                <Typography className={classes.title} variant="h3" gutterBottom>
                    <span className={classes.decoration}></span>{title}
                </Typography>
                <div className={classes.select}>
                    <div className={classes.dateSelect}>
                        <Grid container spacing={14}>
                            <Grid item xs={4}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: true
                                })} onClick={this.toPage({
                                    title,
                                    type: "consumption",
                                    url: "pfmStatistics/getConsumptionDetailed"
                                })}>
                                    本月
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.selectPaper} onClick={this.switchDate(-1)}>
                                    上一月
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.selectPaper} onClick={this.switchDate(+1)}>
                                    下一月
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                    <Paper onClick={this.toPage(null)} className={classNames(classes.selectPaper,{
                        [classes.selectPaperHover]: true
                    })}>
                        返回
                    </Paper>
                </div>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Paper className={classNames(classes.paperChart,{
                            [classes.paperChartDetail]: true
                        })}>
                            <AmountStatisticsChart
                                position={{
                                    left: "5%",
                                    right: "2%"
                                }}
                                splitNumber={8}
                                title={`${date_title}`}
                                showShadow={true} domId="consumptionStatistics"
                                chartData={data.line.map(item => ({
                                    time: item["time"],
                                    amount: item["actual_payment"]
                                }))}
                                width={1224}
                            />
                        </Paper>
                    </Grid>
                </Grid>
                <div className={classNames(classes.select,{
                    [classes.mt10]: true
                })}>
                    <div className={classes.dateSelect}>
                        <Grid container spacing={14}>
                            <Grid item xs={4}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: this.state.typeActive == "salesman"
                                })} onClick={this.handleClick("salesman")}>
                                    业务员
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: this.state.typeActive == "customer"
                                })} onClick={this.handleClick("customer")}>
                                    客户
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </div>
                {
                    this.state.typeActive == "salesman" ? (
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Paper className={classes.dataRoot}>
                                    <Table className={classes.dataTable} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">业务员</StyledTableCell>
                                                <StyledTableCell align="left">所属客户消费金额</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.user_sta.filter((item,index) => index % 3 == 0).map(item => (
                                                    <TableRow>
                                                        <StyledTableCell align="left">
                                                            {item["name"]}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            {item["pfm"]}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.dataRoot}>
                                    <Table className={classes.dataTable} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">业务员</StyledTableCell>
                                                <StyledTableCell align="left">所属客户消费金额</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.user_sta.filter((item,index) => (index+2) % 3 == 0).map(item => (
                                                    <TableRow>
                                                        <StyledTableCell align="left">
                                                            {item["name"]}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            {item["pfm"]}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.dataRoot}>
                                    <Table className={classes.dataTable} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">业务员</StyledTableCell>
                                                <StyledTableCell align="left">所属客户消费金额</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.user_sta.filter((item,index) => (index+1) % 3 == 0).map(item => (
                                                    <TableRow>
                                                        <StyledTableCell align="left">
                                                            {item["name"]}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            {item["pfm"]}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                        </Grid>
                    ) : (
                        <Paper className={classes.dataRoot}>
                            <Table className={classes.dataTable} aria-label="customized table">
                                <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left">流水号</StyledTableCell>
                                    <StyledTableCell align="left">客户</StyledTableCell>
                                    <StyledTableCell align="left">所属业务员</StyledTableCell>
                                    <StyledTableCell align="left">消费金额</StyledTableCell>
                                    <StyledTableCell align="left">支付时间</StyledTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.list.map(item => (
                                            <TableRow>
                                                <StyledTableCell align="left">
                                                    {item["serial_number"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["customer_name"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["name"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["actual_payment"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["pay_time"]}
                                                </StyledTableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    )
                }
            </div>
        );
    }
    businessStatisticsComponent = () => {
        const { classes } = this.props;
        const { title, data, date_title } = this.state.detail;
        return (
            <div>
                <Typography className={classes.title} variant="h3" gutterBottom>
                    <span className={classes.decoration}></span>{title}
                </Typography>
                <div className={classes.select}>
                    <div className={classes.dateSelect}>
                        <Grid container spacing={14}>
                            <Grid item xs={4}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: true
                                })} onClick={this.toPage({
                                    title,
                                    type: "business",
                                    url: "statistics/getBusinessDetailed"
                                })}>
                                    本月
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.selectPaper} onClick={this.switchDate(-1)}>
                                    上一月
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.selectPaper} onClick={this.switchDate(+1)}>
                                    下一月
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                    <Paper onClick={this.toPage(null)} className={classNames(classes.selectPaper,{
                        [classes.selectPaperHover]: true
                    })}>
                        返回
                    </Paper>
                </div>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Paper className={classNames(classes.paperChart,{
                            [classes.paperChartDetail]: true
                        })}>
                            <AmountStatisticsChart
                                position={{
                                    left: "5%",
                                    right: "2%"
                                }}
                                splitNumber={8}
                                title={`${date_title}`}
                                showShadow={true} domId="consumptionStatistics"
                                chartData={data.line.map(item => ({
                                    time: item["time"],
                                    amount: item["num"]
                                }))}
                                width={1224}
                            />
                        </Paper>
                    </Grid>
                </Grid>
                <div className={classNames(classes.select,{
                    [classes.mt10]: true
                })}>
                    <div style={{
                        width: 650
                    }} className={classes.dateSelect}>
                        <Grid container spacing={14}>
                            <Grid item xs={3}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: this.state.typeActive == "allBusiness"
                                })} onClick={this.handleClick("allBusiness")}>
                                    所有业务
                                </Paper>
                            </Grid>
                            <Grid item xs={3}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: this.state.typeActive == "idcBusiness"
                                })} onClick={this.handleClick("idcBusiness")}>
                                    IDC
                                </Paper>
                            </Grid>
                            <Grid item xs={3}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: this.state.typeActive == "dipBusiness"
                                })} onClick={this.handleClick("dipBusiness")}>
                                    高防IP
                                </Paper>
                            </Grid>
                            <Grid item xs={3}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: this.state.typeActive == "overlayBusiness"
                                })} onClick={this.handleClick("overlayBusiness")}>
                                    防御叠加包
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </div>
                {
                    this.state.typeActive == "allBusiness" ? (
                        <Paper className={classes.dataRoot}>
                            <Table className={classes.dataTable} aria-label="customized table">
                                <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left">业务编号</StyledTableCell>
                                    <StyledTableCell align="left">客户</StyledTableCell>
                                    <StyledTableCell align="left">所属业务员</StyledTableCell>
                                    <StyledTableCell align="left">业务类型</StyledTableCell>
                                    <StyledTableCell align="left">资源编号</StyledTableCell>
                                    <StyledTableCell align="left">单价</StyledTableCell>
                                    <StyledTableCell align="left">时间</StyledTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.all_on.map(item => (
                                            <TableRow>
                                                <StyledTableCell align="left">
                                                    {item["business_number"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["customer_name"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["sales_name"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["business_type"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["machine_number"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["price"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["start_time"]}
                                                </StyledTableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    ) : null
                }
                {
                    this.state.typeActive == "idcBusiness" ? (
                        <Paper className={classes.dataRoot}>
                            <Table className={classes.dataTable} aria-label="customized table">
                                <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left">业务编号</StyledTableCell>
                                    <StyledTableCell align="left">客户</StyledTableCell>
                                    <StyledTableCell align="left">业务类型</StyledTableCell>
                                    <StyledTableCell align="left">所属业务员</StyledTableCell>
                                    <StyledTableCell align="left">机器编号</StyledTableCell>
                                    <StyledTableCell align="left">单价</StyledTableCell>
                                    <StyledTableCell align="left">开始时间</StyledTableCell>
                                    <StyledTableCell align="left">结束时间</StyledTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.idc_on.map(item => (
                                            <TableRow>
                                                <StyledTableCell align="left">
                                                    {item["business_number"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["customer_name"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["business_type"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["sales_name"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["machine_number"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["price"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["start_time"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["endding_time"]}
                                                </StyledTableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    ) : null
                }
                {
                    this.state.typeActive == "dipBusiness" ? (
                        <Paper className={classes.dataRoot}>
                            <Table className={classes.dataTable} aria-label="customized table">
                                <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left">业务编号</StyledTableCell>
                                    <StyledTableCell align="left">客户</StyledTableCell>
                                    <StyledTableCell align="left">业务类型</StyledTableCell>
                                    <StyledTableCell align="left">所属业务员</StyledTableCell>
                                    <StyledTableCell align="left">套餐名称</StyledTableCell>
                                    <StyledTableCell align="left">单价</StyledTableCell>
                                    <StyledTableCell align="left">开始时间</StyledTableCell>
                                    <StyledTableCell align="left">结束时间</StyledTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.dip_on.map(item => (
                                            <TableRow>
                                                <StyledTableCell align="left">
                                                    {item["business_number"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["customer_name"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["business_type"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["sales_name"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["machine_number"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["price"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["start_time"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["endding_time"]}
                                                </StyledTableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    ) : null
                }
                {
                    this.state.typeActive == "overlayBusiness" ? (
                        <Paper className={classes.dataRoot}>
                            <Table className={classes.dataTable} aria-label="customized table">
                                <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left">客户</StyledTableCell>
                                    <StyledTableCell align="left">业务类型</StyledTableCell>
                                    <StyledTableCell align="left">所属业务员</StyledTableCell>
                                    <StyledTableCell align="left">套餐名称</StyledTableCell>
                                    <StyledTableCell align="left">单价</StyledTableCell>
                                    <StyledTableCell align="left">时间</StyledTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.overlay_on.map(item => (
                                            <TableRow>
                                                <StyledTableCell align="left">
                                                    {item["customer_name"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["business_type"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["sales_name"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["machine_number"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["price"]}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item["buy_time"]}
                                                </StyledTableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    ) : null
                }
            </div>
        );
    }
    handlePopoverOpen = name => event => {
        this.setState({
            popoverState: name
        });
    }
    handlePopoverClose = () => {
        this.setState({
            popoverState: ""
        });
    }
    detailRender = (type) => {
        switch(type) {
            case "customer":
                return this.customerStatisticsComponent();
            break;
            case "recharge":
                return this.rechargeStatisticsComponent();
            break;
            case "consumption":
                return this.consumptionStatisticsComponent();
            break;
            case "business":
                return this.businessStatisticsComponent();
            break;
        }
    }
    render() {
        const { classes,statisticalOverviewStores } = this.props;
        if(this.state.detail) {
            return this.detailRender(this.state.detail.type);
        }
        return (
            <div className={classes.root}>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Typography className={classes.title} variant="h3" gutterBottom>
                            <span className={classes.decoration}></span>关于充值
                            <a href="javascript:;" onClick={this.toPage({
                                title: "关于充值",
                                type: "recharge",
                                url: "rechargeStatistics/getRechargeDetailed"
                            })} className={classes.link}>
                                更多 >
                            </a>
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Paper onMouseLeave={this.handlePopoverClose} className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>今日充值</span>
                                        <div className={`dehazeIcon ${classes.dehazeIcon}`} />

                                    </header>
                                    <article className={classes.paperArticle}>
                                        {accounting.formatMoney(statisticalOverviewStores.statisticalOverview.recharge.day,"",2)}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper onMouseLeave={this.handlePopoverClose} className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>本月充值</span>
                                        <IconButton onClick={this.handlePopoverOpen("monthRecharge")} className={classNames(classes.iconButton,{
                                            [classes.iconButtonActive]: this.state.popoverState == "monthRecharge"
                                        })}>
                                            {/* <DehazeIcon className={classes.icon} /> */}
                                            <div className={`dehazeIcon ${classes.dehazeIcon}`} />
                                            <div className={`private-mask ${classes.mask}`} />
                                            <div className={`private-popover ${classes.popover}`}>
                                                <Link target="_blank" href={`/tz_admin/rechargeStatistics/getRechargeExcel?month=${this.createDate("YYYY-MM",0)}`} className={classes.popoverList}>
                                                    导出本月记录
                                                </Link>
                                            </div>
                                        </IconButton>
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {accounting.formatMoney(statisticalOverviewStores.statisticalOverview.recharge.month,"",2)}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper onMouseLeave={this.handlePopoverClose} className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>上月充值</span>
                                        <IconButton onClick={this.handlePopoverOpen("nextMonthRecharge")} className={classNames(classes.iconButton,{
                                            [classes.iconButtonActive]: this.state.popoverState == "nextMonthRecharge"
                                        })}>
                                            {/* <DehazeIcon className={classes.icon} /> */}
                                            <div className={`dehazeIcon ${classes.dehazeIcon}`} />
                                            <div className={`private-mask ${classes.mask}`} />
                                            <div className={`private-popover ${classes.popover}`}>
                                                <Link target="_blank" href={`/tz_admin/rechargeStatistics/getRechargeExcel?month=${this.createDate("YYYY-MM",-1)}`} className={classes.popoverList}>
                                                    导出上月记录
                                                </Link>
                                            </div>
                                        </IconButton>
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {accounting.formatMoney(statisticalOverviewStores.statisticalOverview.recharge.nextMonth,"",2)}
                                    </article>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.title} variant="h3" gutterBottom>
                            <span className={classes.decoration}></span>关于消费
                            <a href="javascript:;" onClick={this.toPage({
                                title: "关于消费",
                                type: "consumption",
                                url: "pfmStatistics/getConsumptionDetailed"
                            })} className={classes.link}>
                            更多 >
                            </a>
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Paper onMouseLeave={this.handlePopoverClose} className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>今日消费</span>
                                        <div className={`dehazeIcon ${classes.dehazeIcon}`} />

                                    </header>
                                    <article className={classes.paperArticle}>
                                        {accounting.formatMoney(statisticalOverviewStores.statisticalOverview.consumption.day,"",2)}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper onMouseLeave={this.handlePopoverClose} className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>本月消费</span>
                                        <IconButton onClick={this.handlePopoverOpen("monthConsumption")} className={classNames(classes.iconButton,{
                                            [classes.iconButtonActive]: this.state.popoverState == "monthConsumption"
                                        })}>
                                            {/* <DehazeIcon className={classes.icon} /> */}
                                            <div className={`dehazeIcon ${classes.dehazeIcon}`} />
                                            <div className={`private-mask ${classes.mask}`} />
                                            <div className={`private-popover ${classes.popover}`}>
                                                <Link target="_blank" href={`/tz_admin/pfmStatistics/getConsumptionExcel?month=${this.createDate("YYYY-MM",0)}`} className={classes.popoverList}>
                                                    导出本月记录
                                                </Link>
                                            </div>
                                        </IconButton>
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {accounting.formatMoney(statisticalOverviewStores.statisticalOverview.consumption.month,"",2)}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper onMouseLeave={this.handlePopoverClose} className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>上月消费</span>
                                        <IconButton onClick={this.handlePopoverOpen("nextMonthConsumption")} className={classNames(classes.iconButton,{
                                            [classes.iconButtonActive]: this.state.popoverState == "nextMonthConsumption"
                                        })}>
                                            {/* <DehazeIcon className={classes.icon} /> */}
                                            <div className={`dehazeIcon ${classes.dehazeIcon}`} />
                                            <div className={`private-mask ${classes.mask}`} />
                                            <div className={`private-popover ${classes.popover}`}>
                                                <Link target="_blank" href={`/tz_admin/pfmStatistics/getConsumptionExcel?month=${this.createDate("YYYY-MM",-1)}`} className={classes.popoverList}>
                                                    导出上月记录
                                                </Link>
                                            </div>
                                        </IconButton>
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {accounting.formatMoney(statisticalOverviewStores.statisticalOverview.consumption.nextMonth,"",2)}
                                    </article>

                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.title} variant="h3" gutterBottom>
                            <span className={classes.decoration}></span>关于客户
                            <a href="javascript:;" onClick={this.toPage({
                                title: "关于客户",
                                type: "customer",
                                url: "users/getUsersDetailed"
                            })} className={classes.link}>
                            更多 >
                            </a>
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Paper onMouseLeave={this.handlePopoverClose} className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>今日注册客户</span>
                                        <div className={`dehazeIcon ${classes.dehazeIcon}`} />

                                    </header>
                                    <article className={classes.paperArticle}>
                                        {statisticalOverviewStores.statisticalOverview.customer.day}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper onMouseLeave={this.handlePopoverClose} className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>本月注册客户</span>
                                        <IconButton onClick={this.handlePopoverOpen("monthUsers")} className={classNames(classes.iconButton,{
                                            [classes.iconButtonActive]: this.state.popoverState == "monthUsers"
                                        })}>
                                            {/* <DehazeIcon className={classes.icon} /> */}
                                            <div className={`dehazeIcon ${classes.dehazeIcon}`} />
                                            <div className={`private-mask ${classes.mask}`} />
                                            <div className={`private-popover ${classes.popover}`}>
                                                <Link target="_blank" href={`/tz_admin/users/getUsersExcel?month=${this.createDate("YYYY-MM",0)}`} className={classes.popoverList}>
                                                    导出本月记录
                                                </Link>
                                                <Divider variant="middle" />
                                                <Link target="_blank" href={`/tz_admin/users/getUsersExcel?month=${this.createDate("YYYY-MM",-1)}`} className={classes.popoverList}>
                                                    导出上月记录
                                                </Link>
                                            </div>
                                        </IconButton>
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {statisticalOverviewStores.statisticalOverview.customer.month}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper onMouseLeave={this.handlePopoverClose} className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>总客户数量</span>
                                        <IconButton onClick={this.handlePopoverOpen("total")} className={classNames(classes.iconButton,{
                                            [classes.iconButtonActive]: this.state.popoverState == "total"
                                        })}>
                                            {/* <DehazeIcon className={classes.icon} /> */}
                                            <div className={`dehazeIcon ${classes.dehazeIcon}`} />
                                            <div className={`private-mask ${classes.mask}`} />
                                            <div className={`private-popover ${classes.popover}`}>
                                                <Link target="_blank" href={`/tz_admin/users/getUsersExcelByBusiness?month=${this.createDate("YYYY-MM",0)}`} className={classes.popoverList}>
                                                    导出所有客户
                                                </Link>
                                            </div>
                                        </IconButton>
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {statisticalOverviewStores.statisticalOverview.customer.nextMonth}
                                    </article>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.title} variant="h3" gutterBottom>
                            <span className={classes.decoration}></span>关于业务
                            <a href="javascript:;" onClick={this.toPage({
                                title: "关于业务",
                                type: "business",
                                url: "statistics/getBusinessDetailed"
                            })} className={classes.link}>
                            更多 >
                            </a>
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Paper onMouseLeave={this.handlePopoverClose} className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>本日新增业务</span>
                                        <IconButton onClick={this.handlePopoverOpen("business")} className={classNames(classes.iconButton,{
                                            [classes.iconButtonActive]: this.state.popoverState == "business"
                                        })}>
                                            {/* <DehazeIcon className={classes.icon} /> */}
                                            <div className={`dehazeIcon ${classes.dehazeIcon}`} />
                                            <div className={`private-mask ${classes.mask}`} />
                                            <div className={`private-popover ${classes.popover}`}>
                                                <Link target="_blank" href={`/tz_admin/statistics/getBusinessExcel?month=${this.createDate("YYYY-MM",0)}`} className={classes.popoverList}>
                                                    导出本月记录
                                                </Link>
                                                <Divider variant="middle" />
                                                <Link target="_blank" href={`/tz_admin/statistics/getBusinessExcel?month=${this.createDate("YYYY-MM",-1)}`} className={classes.popoverList}>
                                                    导出上月记录
                                                </Link>
                                            </div>
                                        </IconButton>
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {statisticalOverviewStores.statisticalOverview.machine.today_on}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper onMouseLeave={this.handlePopoverClose} className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>本月上架机器</span>
                                        <IconButton onClick={this.handlePopoverOpen("machine_shelf")} className={classNames(classes.iconButton,{
                                            [classes.iconButtonActive]: this.state.popoverState == "machine_shelf"
                                        })}>
                                            {/* <DehazeIcon className={classes.icon} /> */}
                                            <div className={`dehazeIcon ${classes.dehazeIcon}`} />
                                            <div className={`private-mask ${classes.mask}`} />
                                            <div className={`private-popover ${classes.popover}`}>
                                                <Link target="_blank" href={`/tz_admin/statistics/getMachineExcelByMonth?month=${this.createDate("YYYY-MM",0)}`} className={classes.popoverList}>
                                                    导出本月记录
                                                </Link>
                                                <Divider variant="middle" />
                                                <Link target="_blank" href={`/tz_admin/statistics/getMachineExcelByMonth?month=${this.createDate("YYYY-MM",-1)}`} className={classes.popoverList}>
                                                    导出上月记录
                                                </Link>
                                            </div>
                                        </IconButton>
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {statisticalOverviewStores.statisticalOverview.machine.this_month_on}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper onMouseLeave={this.handlePopoverClose} className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>本月下架机器</span>
                                        <IconButton onClick={this.handlePopoverOpen("machine_off_shelf")} className={classNames(classes.iconButton,{
                                            [classes.iconButtonActive]: this.state.popoverState == "machine_off_shelf"
                                        })}>
                                            {/* <DehazeIcon className={classes.icon} /> */}
                                            <div className={`dehazeIcon ${classes.dehazeIcon}`} />
                                            <div className={`private-mask ${classes.mask}`} />
                                            <div className={`private-popover ${classes.popover}`}>
                                                <Link target="_blank" href={`/tz_admin/statistics/getMachineExcelByMonth?month=${this.createDate("YYYY-MM",0)}`} className={classes.popoverList}>
                                                    导出本月记录
                                                </Link>
                                                <Divider variant="middle" />
                                                <Link target="_blank" href={`/tz_admin/statistics/getMachineExcelByMonth?month=${this.createDate("YYYY-MM",-1)}`} className={classes.popoverList}>
                                                    导出上月记录
                                                </Link>
                                            </div>
                                        </IconButton>
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {statisticalOverviewStores.statisticalOverview.machine.this_month_down}
                                    </article>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.title} variant="h3" gutterBottom>
                            <span className={classes.decoration}></span>6个月充值折线图
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Paper className={classes.paperChart}>
                                    <AmountStatisticsChart domId="recharge" chartData={statisticalOverviewStores.statisticalOverview["rechargeTwelve"]} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.title} variant="h3" gutterBottom>
                            <span className={classes.decoration}></span>6个月消费折线图
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Paper className={classes.paperChart}>
                                    <AmountStatisticsChart showShadow={true} domId="consumption" chartData={statisticalOverviewStores.statisticalOverview["consumptionTwelve"]} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

StatisticalOverviewShow.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(StatisticalOverviewShow);
