import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grid, Table, TableHeaderRow, TableSelection, TableInlineCellEditing } from '@devexpress/dx-react-grid-material-ui';
import { SelectionState, IntegratedSelection, EditingState } from '@devexpress/dx-react-grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { post,get } from "../../tool/http";
import draggableDialogDecorator from '../../decorator/draggable_dialog';

const styles = theme => ({
    total: {
        textAlign: "right",
        fontSize: "18px",
        '& span': {
            color: '#d00'
        },
        margin: "20px 0"
    }
});

const FocusableCell = ({ onClick, column, ...restProps }) => {
    // console.log(restProps);
    return (
        <Table.Cell {...restProps} tabIndex={0} onFocus={column.name === "coupon" ? onClick : null} />
    )
};

@draggableDialogDecorator({
    title: "支付确认",
    type: "action"
  })
  class NewPay extends React.Component {
    state = {
      data: [],
      selection: []
    };

    columns = [
        { name: 'order_sn', title: '订单号' },
        { name: 'business_sn', title: '资源' },
        { name: 'resourcetype', title: '类型' },
        { name: 'price', title: '单价' },
        { name: 'duration', title: '时长' },
        { name: 'payable_money', title: '应付金额' },
        { name: 'end_time', title: '到期时间' },
        { name: 'coupon', title: '优惠金额' }
    ]

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    show = (session_key) => {
        get("business/getorders",{
            id: session_key
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    data: res.data.data.map(item => JSON.parse(item))
                });
                console.log(res.data.data.map(item => JSON.parse(item)));
                this.session_key = session_key;
            } else {
                alert(res.data.msg);
            }
        });
    };

    postForm = (close) => {
        const { data, selection } = this.state;
        const { client } = this.props;
        post("business/pay",{
            payparam: data.filter((item,index) => selection[index] !== undefined).map(item => ({
                id: item.id,
                order_sn: item.order_sn,
                coupon: item.coupon
            })),
            paytype: 1,
            client
        }).then(res => {
            if(res.data.code==1) {
                alert(res.data.msg);
                this.props.update && this.props.update();
                close();
            } else {
                alert(res.data.msg);
            }
        })
        // this.setState({ open: false });
        // get("business/renew_pay",{
        //     session_key: this.session_key
        // }).then(res => {
        //     if(res.data.code==1) {
        //         alert(res.data.msg);
        //         this.props.update && this.props.update();
        //         close();
        //     } else {
        //         alert(res.data.msg);
        //     }
        // })
    };

    setSelection = selection => {
        this.setState({
            selection
        });
    }

    commitChanges = ({ added, changed, deleted }) => {
        const { data } = this.state;
        let changedRows;
        if (added) {
            const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
            changedRows = [
                ...data,
                ...added.map((row, index) => ({
                id: startingAddedId + index,
                ...row,
                })),
            ];
        }
        if (changed) {
            console.log(changed);
            changedRows = data.map((row,index) => (changed[index] ? { ...row, ...changed[index] } : row));
        }
        if (deleted) {
            const deletedSet = new Set(deleted);
            changedRows = data.filter(row => !deletedSet.has(row.id));
        }
        
        this.setState({
            data: changedRows
        });
    }

    render() {
        const { classes } = this.props;
        const { data, selection } = this.state;
        return (
        <div>
            <div className={classes.total}>
                合计：<span>{(data.filter((item,index) => selection[index] !== undefined).reduce((a,b) => a + Number(b.payable_money),0.00)).toFixed(2)}</span>
            </div>
            <Paper>
                <Grid
                    rows={this.state.data}
                    columns={this.columns}
                >
                    <SelectionState
                        selection={this.state.selection}
                        onSelectionChange={this.setSelection}
                    />
                    <EditingState onCommitChanges={this.commitChanges} />
                    <IntegratedSelection />
                    <Table cellComponent={FocusableCell} />
                    <TableHeaderRow />
                    <TableSelection showSelectAll />
                    <TableInlineCellEditing
                        startEditAction={"click"}
                        selectTextOnEditStart={false}
                    />
                </Grid>
            </Paper>
            <FormControl style={{marginTop: 20}} component="fieldset">
                <FormLabel component="legend">支付方式</FormLabel>
                <RadioGroup row aria-label="position" name="position" defaultValue="1">
                    <FormControlLabel value="1" control={<Radio color="primary" />} label="余额" />
                </RadioGroup>
            </FormControl>
        </div>
      );
    }
  }

NewPay.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(NewPay);