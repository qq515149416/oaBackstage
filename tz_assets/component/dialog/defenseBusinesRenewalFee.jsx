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
import { get } from "../../tool/http";
const dateFormat = require('dateformat');

const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    }
});

class DefenseBusinesRenewalFee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: 1,
            renewalFee: false,
            starttime: dateFormat(new Date(new Date().getTime()), 'yyyy-mm-dd')
        }
        this.renewalFeeTypes = [
            {
                label: "一个月",
                value: 1
            },
            {
                label: "六个月",
                value: 6
            },
            {
                label: "一年",
                value: 12
            }
        ]
    }
    open = () => {
        this.setState({
            renewalFee: true
        });
    }
    close = () => {
        this.setState({
            renewalFee: false
        });
    }
    renewalFeeOperat = () => {
        let duration = this.renewalFeeTypes.find(item => item.value == this.state.currency);
        var confirm_next = confirm("是否要为"+this.props[this.props.nameParam]+"，续费时长"+duration.label+"元?");
        if(confirm_next) {
            get(this.props.postUrl,{
                business_id: this.props.id,
                buy_time: this.state.currency,
                start_time: Math.round(new Date(this.state.starttime+" 00:00:00").getTime()/1000)
            }).then((data)=>{
                if(data.data.code==1) {
                    alert(data.data.msg);
                    this.close();
                    this.props.update && this.props.update();
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
            <Tooltip title="高防业务续费">
                    <IconButton className={classes.iconButton} onClick={this.open} aria-label="renewalFee">
                        <RenewalFeeIcon />
                    </IconButton>
                </Tooltip>,
            <Dialog
          open={this.state.renewalFee}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">高防业务续费</DialogTitle>
          <DialogContent>
            <TextField
            id="defenseBusinesRenewalFee"
            select
            label="续费时长"
            fullWidth
            value={this.state.currency}
            onChange={this.handleChange('currency')}
            margin="normal"
            >
                {this.renewalFeeTypes.map(item => (
                    <MenuItem value={item.value}>
                    {item.label}
                 </MenuItem>
                ))}
            </TextField>
            <TextField
                id="date"
                label="开始时间"
                type="date"
                fullWidth
                defaultValue={dateFormat(new Date(new Date().getTime()), 'yyyy-mm-dd')}
                onChange={this.handleChange('starttime')}
                InputLabelProps={{
                shrink: true,
                }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              取消
            </Button>
            <Button onClick={this.renewalFeeOperat} color="primary">
              确定
            </Button>
          </DialogActions>
        </Dialog>
        ];
    }
}
DefenseBusinesRenewalFee.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(DefenseBusinesRenewalFee);
