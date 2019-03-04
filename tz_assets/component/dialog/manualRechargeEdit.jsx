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
import EditIcon from '@material-ui/icons/Edit';
import MenuItem from '@material-ui/core/MenuItem';
import { post,get } from "../../tool/http";
import "layui-laydate/src/theme/default/laydate.css";
import laydate from 'layui-laydate';
const dateFormat = require('dateformat');

const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    }
});

class ManualRechargeEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: this.props.recharge_num,
            manualRecharge: false,
            recharge_amount: this.props.recharge_amount,
            time: dateFormat(new Date(this.props.pay_at),"yyyy-mm-dd'T'HH:MM:ss"),
            remarks: this.props.remarks,
            tax: this.props.tax
        }
    }
    open = () => {
        this.setState({
            manualRecharge: true
        });

    }
    close = () => {
        this.setState({
            manualRecharge: false
        });
    }
    entered = () => {
        // //执行一个laydate实例
        // laydate.render({
        //     elem: '#pay_at' //指定元素
        //     ,type: 'datetime'
        //     ,done: (value, date, endDate) => {
        //         // console.log(value); //得到日期生成的值，如：2017-08-18
        //         // console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
        //         // console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
        //         this.setState({
        //             time: value,
        //         });
        //     }
        // });
    }
    manualRechargeOperat = () => {
        var confirm_next = confirm("是否要修改为"+this.props[this.props.nameParam]+"，充值"+this.state.recharge_amount+"元?");
        if(confirm_next) {
            post(this.props.postUrl,{
                trade_id: this.props.id,
                recharge_amount: this.state.recharge_amount,
                recharge_way: this.state.currency,
                time: this.state.time,
                audit_status: 1,
                remarks: this.state.remarks,
                tax: this.tax.value
            }).then((data)=>{
                if(data.data.code==1) {
                    alert(data.data.msg);
                    if(this.props.update) {
                        this.props.update();
                    }
                    this.close();
                } else {
                    alert(data.data.msg);
                }
            });
        }
    }
    manualRechargeErrorOperat = () => {
        var confirm_next = confirm("是否要修改为"+this.props[this.props.nameParam]+"，充值"+this.state.recharge_amount+"元?");
        if(confirm_next) {
            post(this.props.postUrl,{
                trade_id: this.props.id,
                recharge_amount: this.state.recharge_amount,
                recharge_way: this.state.currency,
                time: this.state.time,
                audit_status: -1,
                remarks: this.state.remarks,
                tax: this.tax.value
            }).then((data)=>{
                if(data.data.code==1) {
                    alert(data.data.msg);
                    if(this.props.update) {
                        this.props.update();
                    }
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
            <Tooltip title="充值修改">
                    <IconButton className={classes.iconButton} onClick={this.open} aria-label="renewalFee">
                        <EditIcon />
                    </IconButton>
                </Tooltip>,
            <Dialog
          open={this.state.manualRecharge}
          onClose={this.close}
          onEntered={this.entered}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">充值修改</DialogTitle>
          <DialogContent>
              <div>
                <p>客户名称：{this.props.customer_name}</p>
                <p>业务员：{this.props.recharger}</p>
                <p>金额：{this.props.recharge_amount}</p>
                <p>到账时间：{this.props.pay_at}</p>
                {/* <p>备注：{this.props.remarks}</p> */}
              </div>
          <TextField
              margin="dense"
              id="note"
              label="修改金额"
              fullWidth
              value={this.state.recharge_amount}
              onChange={this.handleChange('recharge_amount')}
              inputRef = {ref => this.recharge_amount = ref}
            />
            <TextField
              margin="dense"
              id="note"
              label="税额"
              fullWidth
              value={this.state.tax}
              onChange={this.handleChange('tax')}
              inputRef = {ref => this.tax = ref}
            />
            <TextField
            id="recharge_way"
            select
            label="修改付款方式"
            fullWidth
            value={this.state.currency}
            onChange={this.handleChange('currency')}
            margin="normal"
            >
                <MenuItem value={1}>
                    腾正公帐(建设银行)
                </MenuItem>
                <MenuItem value={2}>
                    腾正公帐(工商银行)
                </MenuItem>
                <MenuItem value={3}>
                    腾正公帐(招商银行)
                </MenuItem>
                <MenuItem value={4}>
                    腾正公帐(农业银行)
                </MenuItem>
                <MenuItem value={5}>
                    正易公帐(中国银行)
                </MenuItem>
                <MenuItem value={6}>
                    支付宝
                </MenuItem>
                <MenuItem value={7}>
                    公帐支付宝
                </MenuItem>
                <MenuItem value={8}>
                    财付通
                </MenuItem>
                <MenuItem value={9}>
                    微信支付
                </MenuItem>
                <MenuItem value={10}>
                    新支付宝
                </MenuItem>
            </TextField>
            <TextField
                id="datetime-local"
                label="到账时间"
                type="datetime-local"
                value={this.state.time}
                onChange={this.handleChange('time')}
                InputLabelProps={{
                    shrink: true,
                }}
                inputRef={(ref) => this.time = ref}
                fullWidth
            />
            <TextField
                id="remarks"
                label="备注"
                value={this.state.remarks}
                onChange={this.handleChange('remarks')}
                multiline
                rows="4"
                margin="normal"
                inputRef={(ref) => this.remarks = ref}
                fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              取消
            </Button>
            <Button onClick={this.manualRechargeErrorOperat} color="primary">
              不通过
            </Button>
            <Button onClick={this.manualRechargeOperat} color="primary">
              通过
            </Button>
          </DialogActions>
        </Dialog>
        ];
    }
}
ManualRechargeEdit.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ManualRechargeEdit);
