import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import RenewalFeeIcon from "../icon/renewalFee.jsx";
import MenuItem from '@material-ui/core/MenuItem';
import {post} from "../../tool/http";
import "layui-laydate/src/theme/default/laydate.css";
import laydate from 'layui-laydate';

const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    }
});

class ManualRecharge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: 6,
            manualRecharge: false
        }
    }
    open = () => {

        this.setState({
            manualRecharge: true
        });
    }
    entered = () => {
        laydate.render({
            elem: '#pay_at', //指定元素
            type: 'datetime',
            // format: 'yyyy-MM-dd HH:mm',
            done: (value, date, endDate) => {
                this.time = {
                    value,
                }
            }
        });
    }
    close = () => {
        this.setState({
            manualRecharge: false
        });
    }
    manualRechargeOperat = () => {
        var confirm_next = confirm("是否要为"+this.props[this.props.nameParam]+"，充值"+this.recharge_amount.value+"元?");
        if(confirm_next) {
            post(this.props.postUrl,{
                user_id: this.props.id,
                recharge_amount: this.recharge_amount.value,
                recharge_way: this.state.currency,
                remarks: this.note.value,
                time: this.time.value,
                tax: this.tax.value
            }).then((data)=>{
                if(data.data.code==1) {
                    alert("充值成功");
                    this.close();
                } else {
                    alert(data.data.msg);
                }
            });
        }
    }
    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    }
    render() {
        const { classes } = this.props;
        return [
            (this.props.buttonEl ? this.props.buttonEl(this.open) : <Tooltip title="手动充值">
            <IconButton className={classes.iconButton} onClick={this.open} aria-label="renewalFee">
                <RenewalFeeIcon />
            </IconButton>
        </Tooltip> )
            ,
            <Dialog
          open={this.state.manualRecharge}
          onClose={this.close}
          onEntered={this.entered}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">手动充值</DialogTitle>
          <DialogContent>
          <TextField
              margin="dense"
              id="note"
              label="充值金额"
              fullWidth
              inputRef = {ref => this.recharge_amount = ref}
            />
            <TextField
              margin="dense"
              id="note"
              label="税额"
              fullWidth
              inputRef = {ref => this.tax = ref}
            />
            <TextField
            id="recharge_way"
            select
            label="付款方式"
            fullWidth
            value={this.state.currency}
            onChange={this.handleChange('currency')}
            margin="normal"
            >
                <MenuItem value={6}>
                    支付宝
                </MenuItem>
                <MenuItem value={9}>
                    微信支付
                </MenuItem>
                <MenuItem value={3}>
                    腾正公帐(招商银行)
                </MenuItem>
                <MenuItem value={4}>
                    腾正公帐(农业银行)
                </MenuItem>
                <MenuItem value={2}>
                    腾正公帐(工商银行)
                </MenuItem>
                <MenuItem value={1}>
                    腾正公帐(建设银行)
                </MenuItem>
                <MenuItem value={5}>
                    正易公帐(中国银行)
                </MenuItem>

                <MenuItem value={7}>
                    公帐支付宝
                </MenuItem>
                <MenuItem value={10}>
                    新支付宝
                </MenuItem>
                <MenuItem value={8}>
                    财付通
                </MenuItem>
            </TextField>
            <TextField
              margin="dense"
              id="note"
              label="备注"
              fullWidth
              inputRef = {ref => this.note = ref}
            />
            {/* <TextField
                id="datetime-local"
                label="到账时间"
                type="datetime-local"
                InputLabelProps={{
                    shrink: true,
                }}
                inputRef={(ref) => this.time = ref}
                fullWidth
            /> */}
            <TextField
              margin="dense"
              id="pay_at"
              label="到账时间"
              InputLabelProps={{
                    shrink: true,
                }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              取消
            </Button>
            <Button onClick={this.manualRechargeOperat} color="primary">
              确定
            </Button>
          </DialogActions>
        </Dialog>
        ];
    }
}
ManualRecharge.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ManualRecharge);
