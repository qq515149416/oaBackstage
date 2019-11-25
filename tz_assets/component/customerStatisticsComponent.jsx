import React, { useState, useEffect } from 'react';
import { withStyles ,makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AmountStatisticsChart from '../component/chart/amountStatisticsChart.jsx';
import { get } from "../tool/http";
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

const useStyles = makeStyles({
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
    dataRoot: {
        marginTop: 14,
        overflowX: "auto",
        boxShadow: "0 0 7px rgba(107,140,159,.2)",
        borderRadius: 6
    },
    dataTable: {

    }
});
export default function CustomerStatisticsComponent(props) {
    const [detail,setDetail] = useState({
        data: {
            line: [],
            info: []
        },
        date_title: ""
    });
    const { data, date_title } = detail;
    const classes = useStyles();
    const init = () => {
        const date = moment().format("YYYY-MM");
        let data = {};
        get("users/getUsersDetailed",{
            month: date
        }).then(res => {
            if(res.data.code==1) {
                data["data"] = res.data.data;
                data["currentDate"] = moment();
                data["date_title"] = moment().format("YYYY/MM")+"/01"+" ~ "+moment().format("YYYY/MM")+"/"+moment().daysInMonth();
                data["data"]["info"] = data["data"]["info"] || [];
                data["data"]["line"] = data["data"]["line"] || [];
                setDetail(data);
            }
        });
    }
    // useEffect(() => {
    //     // Update the document title using the browser API
    //     init();
    // });
    const switchDate = (_switch) => {
        let date = moment();
        const data = detail;
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
        get("users/getUsersDetailed",{
            month: nowDate.format("YYYY-MM")
        }).then(res => {
            if(res.data.code==1) {
                data["date_title"] = nowDate.format("YYYY/MM")+"/01"+" ~ "+nowDate.format("YYYY/MM")+"/"+nowDate.daysInMonth();
                data["data"] = res.data.data;
                data["currentDate"] = nowDate;
                if(data["data"].line && data["data"].info) {
                    setDetail(data);
                } else {
                    alert("没数据");
                }
            }
        });
    }
    return (
        <div>
            <Typography className={classes.title} variant="h3" gutterBottom>
                <span className={classes.decoration}></span>{props.title}
            </Typography>
            <div className={classes.select}>
                <div className={classes.dateSelect}>
                    <Grid container spacing={14}>
                        <Grid item xs={4}>
                            <Paper className={classNames(classes.selectPaper,{
                                [classes.selectPaperHover]: true
                            })} onClick={() => init()}>
                                本月
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper className={classes.selectPaper} onClick={() => switchDate(-1)}>
                                上一月
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper className={classes.selectPaper} onClick={() => switchDate(+1)}>
                                下一月
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
                <Paper onClick={props.closePage("")} className={classNames(classes.selectPaper,{
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
