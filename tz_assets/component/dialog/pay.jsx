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
import { post,get } from "../../tool/http";

const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
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
      }
});

function PaperComponent(props) {
    return (
      <Draggable>
        <Paper {...props} />
      </Draggable>
    );
  }

  class Pay extends React.Component {
    state = {
      open: false,
      data: []
    };

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    handleClickOpen = (session_key) => {
        get("business/show_renew_order",{
            session_key
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    data: res.data.data,
                    open: true
                });
                this.session_key = session_key;
            } else {
                alert(res.data.msg);
            }
        });
    };

    handlePay = () => {
        // this.setState({ open: false });
        get("business/renew_pay",{
            session_key: this.session_key
        }).then(res => {
            if(res.data.code==1) {
                alert(res.data.msg);
                this.setState({ open: false });
            } else {
                alert(res.data.msg);
            }
        })
    };

    handleClose = () => {
      this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        const { data } = this.state;
      return (
        <span>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            PaperComponent={PaperComponent}
            disableBackdropClick
            aria-labelledby="draggable-dialog-title"
            maxWidth="lg"
            scroll="paper"
          >
            <DialogTitle id="draggable-dialog-title">订单确认</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <div className={classes.total}>
                        合计：<span>{data.reduce((a,b) => a + parseFloat(b.payable_money),0)}</span>
                    </div>
                    <Table className={classes.table}>
                        <TableHead>
                        <TableRow>
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
                        {data.map(row => (
                            <TableRow className={classes.row} key={row.order_sn}>
                                <CustomTableCell>
                                    {row.order_sn}
                                </CustomTableCell>
                                <CustomTableCell>{row.machine_sn}</CustomTableCell>
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
        </span>
      );
    }
  }

Pay.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Pay);
