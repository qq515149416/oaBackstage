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

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: "#ebf5fb",
        color: "#3c3c3c",
        fontFamily: "微软雅黑",
        fontSize: "14px",
        fontWeight: "bold"
    },
    body: {
        fontSize: "14px",
        fontFamily: "微软雅黑",
        fontSize: "14px",
        color: "#666666"
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
            boxShadow: "0 0 24px 5px rgba(3,130,204,.6)",
            "& article": {
                color: "#fff"
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
        paddingBottom: 0
    },
    paperHeader: {
        display: "flex",
        justifyContent: "space-between"
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
        dateActive: "cm"
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
    switchDate = _switch => event => {
        const date = new Date();
        const data = this.state.detail;
        const { page } = data;
        const switched = (date.getMonth() + 1) + (page + _switch);
        if(switched < 1 || switched > (date.getMonth() + 1)) {
            alert("到底了！");
            return ;
        }
        const month = this.formateDate((date.getMonth() + 1) + (page + _switch));
        get("users/getUsersDetailed",{
            month: date.getFullYear() + "-" + month
        }).then(res => {
            if(res.data.code==1) {
                data["date_title"] = date.getFullYear() + "/" + month;
                data["data"] = res.data.data;
                data["page"] = (page + _switch);
                if(data["data"].line && data["data"].info) {
                    this.setState({
                        detail: data
                    });
                } else {
                    alert("没数据");
                }
            }
        });
    }
    toPage = data => event => {
        if(data) {
            const date = new Date();
            get("users/getUsersDetailed",{
                month: date.getFullYear() + "-" + this.formateDate(date.getMonth() + 1)
            }).then(res => {
                if(res.data.code==1) {
                    data["data"] = res.data.data;
                    data["page"] = 0;
                    data["date_title"] = date.getFullYear() + "/" + this.formateDate(date.getMonth() + 1);
                    data["data"]["info"] = data["data"]["info"] || [];
                    data["data"]["line"] = data["data"]["line"] || [];
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
    detailRender = () => {
        const { classes,statisticalOverviewStores } = this.props;
        const { title, data, date_title } = this.state.detail;
        console.log(date_title);
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
                                    [classes.selectPaperHover]: this.state.dateActive === "cm"
                                })} onClick={this.toPage({
                                    title,
                                })}>
                                    本月
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: this.state.dateActive === "lm"
                                })} onClick={this.switchDate(-1)}>
                                    上一月
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classNames(classes.selectPaper,{
                                    [classes.selectPaperHover]: this.state.dateActive === "nm"
                                })} onClick={this.switchDate(+1)}>
                                    下一月
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                    <Paper onClick={this.toPage(null)} className={classes.selectPaper}>
                        返回
                    </Paper>
                </div>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Paper className={classNames(classes.paperChart,{
                            [classes.paperChartDetail]: true
                        })}>
                            <AmountStatisticsChart splitNumber={8} title={`${date_title}/01 ~ ${date_title}/30`} showShadow={true} domId="customer" chartData={data.line.map(item => ({
                                time: item["time"],
                                amount: item["num"]
                            }))} />
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
    render() {
        const { classes,statisticalOverviewStores } = this.props;
        if(this.state.detail) {
            return this.detailRender();
        }
        return (
            <div className={classes.root}>
                <Grid container spacing={32}>
                    <Grid item xs={6}>
                        <Typography className={classes.title} variant="h3" gutterBottom>
                            <span className={classes.decoration}></span>关于充值
                            <a href="javascript:;" className={classes.link}>
                            更多 >
                            </a>
                        </Typography>
                        <Grid container spacing={16}>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>今日充值</span>
                                        <DehazeIcon className={classes.icon} />
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {accounting.formatMoney(statisticalOverviewStores.statisticalOverview.recharge.day,"",2)}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>本月充值</span>
                                        <DehazeIcon className={classes.icon} />
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {accounting.formatMoney(statisticalOverviewStores.statisticalOverview.recharge.month,"",2)}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>上月充值</span>
                                        <DehazeIcon className={classes.icon} />
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
                            <a href="javascript:;" className={classes.link}>
                            更多 >
                            </a>
                        </Typography>
                        <Grid container spacing={16}>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>今日消费</span>
                                        <DehazeIcon className={classes.icon} />
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {accounting.formatMoney(statisticalOverviewStores.statisticalOverview.consumption.day,"",2)}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>本月消费</span>
                                        <DehazeIcon className={classes.icon} />
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {accounting.formatMoney(statisticalOverviewStores.statisticalOverview.consumption.month,"",2)}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>上月消费</span>
                                        <DehazeIcon className={classes.icon} />
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
                                title: "关于客户"
                            })} className={classes.link}>
                            更多 >
                            </a>
                        </Typography>
                        <Grid container spacing={16}>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>今日注册客户</span>
                                        <DehazeIcon className={classes.icon} />
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {statisticalOverviewStores.statisticalOverview.customer.day}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>本月注册客户</span>
                                        <DehazeIcon className={classes.icon} />
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {statisticalOverviewStores.statisticalOverview.customer.month}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>总客户数量</span>
                                        <DehazeIcon className={classes.icon} />
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
                            <a href="javascript:;" className={classes.link}>
                            更多 >
                            </a>
                        </Typography>
                        <Grid container spacing={16}>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>本日新增业务</span>
                                        <DehazeIcon className={classes.icon} />
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {statisticalOverviewStores.statisticalOverview.machine.today_on}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>本月上架机器</span>
                                        <DehazeIcon className={classes.icon} />
                                    </header>
                                    <article className={classes.paperArticle}>
                                        {statisticalOverviewStores.statisticalOverview.machine.this_month_on}
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>本月下架机器</span>
                                        <DehazeIcon className={classes.icon} />
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
                        <Grid container spacing={16}>
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
                        <Grid container spacing={16}>
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
