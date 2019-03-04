import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Order from "../icon/order.jsx";
import {post} from "../../tool/http";

const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    }
});

class OrderShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: false,
            data: {}
        }
    }
    open = () => {
        post("business/clerk",{
            business_sn: this.props.business_number
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    order: true,
                    data: res.data.data
                });
            }
        });
    }
    close = () => {
        this.setState({
            order: false
        });
    }
    render() {
        const {data} = this.state;
        const { classes } = this.props;
        return [
            <Tooltip title="查看业务订单">
                    <IconButton className={classes.iconButton} onClick={this.open} aria-label="changePassword">
                        <Order />
                    </IconButton>
                </Tooltip>,
            <Dialog
          open={this.state.order}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">查看业务订单</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <p>
                订单号: {data.order_sn}
              </p>
              <p>
                客户: {data.customer_name}
              </p>
              <p>
                业务号: {data.business_sn}
              </p>
              <p>
                业务员: {data.business_name}
              </p>
              <p>
                支付前余额: {data.before_money}
              </p>
              <p>
                支付后余额: {data.after_money}
              </p>
              <p>
                资源类型: {data.resource_type}
              </p>
              <p>
                订单类型: {data.order_type}
              </p>
              <p>
                单价: {data.price}
              </p>
              <p>
                时长: {data.duration}
              </p>
              <p>
                应付金额: {data.payable_money}
              </p>
              <p>
                到期时间: {data.end_time}
              </p>
              <p>
                支付方式: {data.pay_type}
              </p>
              <p>
                实付金额: {data.pay_price}
              </p>
              <p>
                支付流水号: {data.serial_number}
              </p>
              <p>
                支付时间: {data.pay_time}
              </p>
              <p>
                订单状态: {data.order_status}
              </p>
              <p>
                订单备注: {data.order_note}
              </p>
              <p>
                创建时间: {data.created_at}
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              关闭
            </Button>
          </DialogActions>
        </Dialog>
        ];
    }
}

OrderShow.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderShow);
