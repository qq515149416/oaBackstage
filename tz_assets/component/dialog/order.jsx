import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import dialogDecorator from '../../decorator/dialog';
import { AntTab, AntTabs } from '../rewrite/antTabs.jsx';
import { RowDetailState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableRowDetail } from '@devexpress/dx-react-grid-material-ui';
import { post, get } from "../../tool/http";
import { RenewalFeeNormalButtonStyle as RenewalFeeNormalButton } from './renewalFee.jsx';
import { DisposalNormalButtonStyle as DisposalNormalButton } from './disposal.jsx';
// import IconButton from './iconButton/index.jsx';
// import OrderIcon from "../icon/order.jsx";

const columns = [
    { name: 'resource_businessnum', title: '业务编号' },
    { name: 'customer_name', title: '客户' },
    { name: 'saler_name', title: '业务员' },
    { name: 'resource_num', title: '资源编号' },
    { name: 'resource_detail', title: '资源参数' },
    { name: 'price', title: '资源单价' },
    { name: 'end_time', title: '到期时间' },
    { name: 'status_decode', title: '业务状态' },
    { name: 'remove', title: '下架状态' }
];


const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 400,
        alignItems: "stretch"
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    }
})

@dialogDecorator({
    title: "资源管理",
    icon: "order"
})
class Order extends React.Component {
    state = {
        data: [],
        tab_value: "4"
    }
    componentDidMount() {
        const { getRef } = this.props;
        getRef && getRef(this);
    }
    show = () => {
        this.getData();
    }
    getData = (params={}) => {
        get("business/showresource",{
            id: this.props.id,
            ...params
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    data: res.data.data
                });
            } else {
                console.warn(res.data.msg);
                this.setState({
                    data: []
                });
            }
        })
    }
    rowDetail = ({ row }) => {
        return (
            <div>
                <RenewalFeeNormalButton {...row} nameParam="resource_detail" type="" order_sn={Math.round(new Date().getTime()/1000)+row.id} />
                {' '}
                <DisposalNormalButton {...row} disposal_type={2} />
            </div>
        )
    }
    handleTabValue = (event,value) => {
        this.getData({
            resource_type: value
        });
        this.setState({
            tab_value: value
        });
    }
    render() {
        const { classes } = this.props;
        const { data, tab_value } = this.state;
        return (
            <div className={classes.root}>
                <AntTabs
                    orientation="vertical"
                    variant="scrollable"
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                    value={tab_value}
                    onChange={this.handleTabValue}
                >
                    <AntTab label="IP" value="4" />
                    <AntTab label="CPU" value="5" />
                    <AntTab label="内存" value="7" />
                    <AntTab label="硬盘" value="6" />
                    <AntTab label="带宽" value="8" />
                    <AntTab label="防护" value="9" />
                </AntTabs>
                <div style={{flex: 1,overflow: "auto"}}>
                    <Grid
                        rows={data}
                        columns={columns}
                    >
                        <RowDetailState
                            defaultExpandedRowIds={[1]}
                        />
                        <Table />
                        <TableHeaderRow />
                        <TableRowDetail
                            contentComponent={this.rowDetail}
                        />
                    </Grid>
                </div>
            </div>
        )
    }
}

Order.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Order)