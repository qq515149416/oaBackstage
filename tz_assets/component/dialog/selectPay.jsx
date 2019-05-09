import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Enable from "../icon/enable.jsx";
import { post,get } from "../../tool/http";

const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.primary[500],
      color: theme.palette.common.white,
      fontSize: 14
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
      },
      table: {
        minWidth: 700,
      },
      row: {
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.background.default,
        },
      },
      total: {
          textAlign: "right",
          fontSize: "18px",
          '& span': {
              color: '#d00'
          },
          margin: "20px 0"
      },
      iconButton: {
        ...theme.tableIconButton
      }
});

function PaperComponent(props) {
    return (
      <Draggable>
        <Paper {...props} />
      </Draggable>
    );
  }

  class SelectPay extends React.Component {
    state = {
      open: false,
      data: [],
      isAll: false
    };

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    handleClickOpen = () => {
        post("business/clerk",{
            business_sn: this.props.business_number
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    data: res.data.data.filter(item => item["status"] === 0).map(item => {
                        item["checked"] = false;
                        return item;
                    }),
                    open: true
                });
            } else {
                alert(res.data.msg);
            }
        });
    };

    handlePay = () => {
        post("business/payOrderByAdmin",{
            order_id: this.state.data.filter(item => item["checked"]).map(item => {
                return item["id"];
            })
        }).then(res => {
            if(res.data.code==1) {
                // alert("支付成功");
                this.props.update && this.props.update();
                this.handleClose();
            }
            alert(res.data.msg);
        })
        // this.setState({ open: false });
        // get("business/payOrderByAdmin",{
        //     session_key: this.session_key
        // }).then(res => {
        //     if(res.data.code==1) {
        //         alert(res.data.msg);
        //         this.setState({ open: false });
        //     } else {
        //         alert(res.data.msg);
        //     }
        // })
    };

    handleCheck = id => event => {
        this.setState(state => {
            state["data"] = state["data"].map(item => {
                if(item["id"]==id) {
                    item["checked"] = !item["checked"];
                }
                return item;
            });
            return state;
        });
    }

    handleCheckAll = event => {
        this.setState(state => {
            state["data"] = state["data"].map(item => {
                item["checked"] = !state.isAll;
                return item;
            });
            state.isAll = !state.isAll;
            return state;
        });
    }

    handleClose = () => {
      this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        const { data } = this.state;
        console.log(data);
      return [
        <Tooltip title="资源支付">
        <IconButton className={classes.iconButton} onClick={this.handleClickOpen} aria-label="renewalFee">
          <Enable/>
        </IconButton>
      </Tooltip>,
        <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="draggable-dialog-title">订单支付</DialogTitle>
        <DialogContent>
            <DialogContentText>
                <div className={classes.total}>
                    合计：<span>{data.filter(item => item["checked"]).reduce((a,b) => a + parseFloat(b.payable_money),0).toFixed(2)}</span>
                </div>
                <Table className={classes.table}>
                    <TableHead>
                    <TableRow>
                        <CustomTableCell padding="checkbox">
                            <Checkbox onChange={this.handleCheckAll} value="all" />
                        </CustomTableCell>
                        <CustomTableCell>订单号</CustomTableCell>
                        <CustomTableCell>资源</CustomTableCell>
                        <CustomTableCell>类型</CustomTableCell>
                        <CustomTableCell>单价</CustomTableCell>
                        <CustomTableCell>时长</CustomTableCell>
                        <CustomTableCell>应付金额</CustomTableCell>
                        <CustomTableCell>到期时间</CustomTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.filter(item => item["status"] === 0).map(row => (
                        <TableRow onClick={this.handleCheck(row.id)} className={classes.row} key={row.order_sn}>
                            <TableCell padding="checkbox">
                                <Checkbox checked={row.checked} value={row.id} />
                            </TableCell>
                            <CustomTableCell>
                                {row.order_sn}
                            </CustomTableCell>
                            <CustomTableCell>{row.resource}</CustomTableCell>
                            <CustomTableCell>{row.resourcetype}</CustomTableCell>
                            <CustomTableCell>{row.price}</CustomTableCell>
                            <CustomTableCell>{row.duration}</CustomTableCell>
                            <CustomTableCell>{row.payable_money}</CustomTableCell>
                            <CustomTableCell>{row.end_time}</CustomTableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            取消
          </Button>
          <Button onClick={this.handlePay} color="primary">
            确定支付
          </Button>
        </DialogActions>
      </Dialog>
      ];
    }
  }

SelectPay.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SelectPay);
