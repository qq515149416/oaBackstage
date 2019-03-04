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
import ChangePassword from "../icon/changePassword.jsx";
import {post} from "../../tool/http";

const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    }
  });

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resetPassword: false
        }
    }
    open = () => {
        this.setState({
            resetPassword: true
        });
    }
    close = () => {
        this.setState({
            resetPassword: false
        });
    }
    changePassword = () => {
        var confirm_next = confirm("是否要将"+this.props.email+"用户的密码，更改为："+this.password.value);
        if(confirm_next) {
            post("business/reset_password",{
                id: this.props.id,
                password: this.password.value
            }).then((data)=>{
                if(data.data.code==1) {
                    alert("更改成功");
                    this.close();
                } else {
                    alert(data.data.msg);
                }
            });
        }
    }
    render() {
        const { classes } = this.props;
        return [
            <Tooltip title="修改密码">
                    <IconButton className={classes.iconButton} onClick={this.open} aria-label="changePassword">
                        <ChangePassword />
                    </IconButton>
                </Tooltip>,
            <Dialog
          open={this.state.resetPassword}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">修改密码</DialogTitle>
          <DialogContent>
            <DialogContentText>
              此功能是后台替用户强制修改密码
            </DialogContentText>
            <TextField
              margin="dense"
              id="name"
              label="新密码"
              fullWidth
              inputRef = {ref => this.password = ref}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              取消
            </Button>
            <Button onClick={this.changePassword} color="primary">
              修改
            </Button>
          </DialogActions>
        </Dialog>
        ];
    }
}
ResetPassword.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResetPassword);
