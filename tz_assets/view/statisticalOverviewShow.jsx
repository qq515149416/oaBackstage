import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import DehazeIcon from '@material-ui/icons/Dehaze';
import AmountStatisticsChart from '../component/chart/amountStatisticsChart.jsx';

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
    }
})

class StatisticalOverviewShow extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={32}>
                    <Grid item xs={6}>
                        <Typography className={classes.title} variant="h3" gutterBottom>
                            <span className={classes.decoration}></span>关于充值
                        </Typography>
                        <Grid container spacing={16}>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>今日充值</span>
                                        <DehazeIcon className={classes.icon} />
                                    </header>
                                    <article className={classes.paperArticle}>
                                        8888.88
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
                                        8888.88
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
                                        8888.88
                                    </article>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.title} variant="h3" gutterBottom>
                            <span className={classes.decoration}></span>关于消费
                        </Typography>
                        <Grid container spacing={16}>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>今日消费</span>
                                        <DehazeIcon className={classes.icon} />
                                    </header>
                                    <article className={classes.paperArticle}>
                                        8888.88
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
                                        8888.88
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
                                        8888.88
                                    </article>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.title} variant="h3" gutterBottom>
                            <span className={classes.decoration}></span>关于客户
                        </Typography>
                        <Grid container spacing={16}>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>今日注册客户</span>
                                        <DehazeIcon className={classes.icon} />
                                    </header>
                                    <article className={classes.paperArticle}>
                                        88
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
                                        888
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
                                        8888
                                    </article>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.title} variant="h3" gutterBottom>
                            <span className={classes.decoration}></span>关于机器
                        </Typography>
                        <Grid container spacing={16}>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>本月上架机器</span>
                                        <DehazeIcon className={classes.icon} />
                                    </header>
                                    <article className={classes.paperArticle}>
                                        88
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
                                        888
                                    </article>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <header className={classes.paperHeader}>
                                        <span>正常使用机器</span>
                                        <DehazeIcon className={classes.icon} />
                                    </header>
                                    <article className={classes.paperArticle}>
                                        8888
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
                                    <AmountStatisticsChart domId="recharge" chartData={[820, 932, 901, 934, 1290, 1330, 1320]} />
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
                                    <AmountStatisticsChart showShadow={true} domId="consumption" chartData={[820, 932, 901, 934, 1290, 1330, 1320]} />
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
