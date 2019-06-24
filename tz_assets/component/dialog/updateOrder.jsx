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
// import ChangePassword from "../icon/changePassword.jsx";
import EditAttributes from "@material-ui/icons/EditAttributes";
import {post} from "../../tool/http";
const dateFormat = require('dateformat');

const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    }
  });

class UpdateOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateOrder: false,
            price: this.props.price,
            end_time: this.props.end_time
        }
    }
    open = () => {
        post("business/clerk",{
            ...this.props
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    updateOrder: true,
                    price: res.data.data[0].price,
                    end_time: res.data.data[0].end_time
                });
            }
        });

    }
    close = () => {
        this.setState({
            updateOrder: false
        });
    }
    handleChange = name => event => {
        this.setState({
            [name] : event.target.value
        });
    }
    changeUpdateOrder = () => {
        var confirm_next = confirm("是否要将"+this.props[this.props.nameParam]+"订单，更改为：价格："+this.state.price+"到期时间："+this.state.end_time);
        if(confirm_next) {
            post(this.props.postUrl,{
                id: this.props.id,
                price: this.state.price,
                end_time: Math.round(new Date(this.state.end_time).getTime()/1000)
            }).then((data)=>{
                if(data.data.code==1) {
                    this.close();
                    this.props.update && this.props.update();
                }
                alert(data.data.msg);
            });
        }
    }
    render() {
        const { classes } = this.props;
        const { price, end_time } = this.state;
        return [
            <Tooltip title="修改订单">
                    <IconButton className={classes.iconButton} onClick={this.open} aria-label="changePassword">
                        <EditAttributes />
                    </IconButton>
                </Tooltip>,
            <Dialog
          open={this.state.updateOrder}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">修改订单</DialogTitle>
          <DialogContent>
            <DialogContentText>
                <TextField
                    id="price"
                    label="价格"
                    value={price}
                    fullWidth
                    onChange={this.handleChange('price')}
                    margin="normal"
                />
                <TextField
                    id="end_time"
                    label="到期时间"
                    type="datetime-local"
                    fullWidth
                    onChange={this.handleChange('end_time')}
                    defaultValue={dateFormat(new Date(end_time),"isoDateTime",true).split("+")[0]}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              取消
            </Button>
            <Button onClick={this.changeUpdateOrder} color="primary">
              修改
            </Button>
          </DialogActions>
        </Dialog>
        ];
    }
}
UpdateOrder.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UpdateOrder);
