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
import InfoIcon from "../icon/info.jsx";

import {post} from "../../tool/http";

const styles = theme => ({
    decoration: {
        margin: "0 5px"
    },
    iconButton: {
        ...theme.tableIconButton
    }
});

class InputUserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userModifyInfo: false,
            qq: "",
            iphone: "",
            note: "",
            name: "",
            nickname: ""
        };
    }
    open = () => {
        this.setState({
            userModifyInfo: true,
            qq: this.props.msg_qq,
            iphone: this.props.msg_phone,
            note: this.props.remarks,
            name: this.props.name,
            nickname: this.props.nickname
        });
    }
    close = () => {
        this.setState({
            userModifyInfo: false
        });
    }
    userModifyInfoOperat = () => {
        post("users/updateUserInfo",{
            uid: this.props.id,
            msg_phone: this.state.iphone,
            msg_qq: this.state.qq,
            remarks: this.state.note,
            name: this.state.name,
            nickname: this.state.nickname
        }).then(res => {
            if(res.data.code==1) {
                alert(res.data.msg);
                if(this.props.update) {
                    this.props.update();
                }
                this.close();
            } else {
                alert(res.data.msg);
            }
        })
    }
    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    }
    render() {
        const {classes} = this.props;
        return [
            <Tooltip title="信息修改">
                <IconButton className={classes.iconButton} onClick={this.open} aria-label="userModifyInfo">
                    <InfoIcon />
                </IconButton>
            </Tooltip>,
            <Dialog
            open={this.state.userModifyInfo}
            onClose={this.close}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">客户信息修改</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    id="note"
                    label="用户名"
                    fullWidth
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                    inputRef = {ref => this.name = ref}
                    disabled
                />
                <TextField
                    margin="dense"
                    id="note"
                    label="昵称"
                    fullWidth
                    value={this.state.nickname}
                    onChange={this.handleChange('nickname')}
                    inputRef = {ref => this.nickname = ref}
                />
                <TextField
                margin="dense"
                id="note"
                label="QQ"
                fullWidth
                value={this.state.qq}
                onChange={this.handleChange('qq')}
                inputRef = {ref => this.qq = ref}
              />
              <TextField
                margin="dense"
                id="note"
                label="手机号码"
                fullWidth
                value={this.state.iphone}
                onChange={this.handleChange('iphone')}
                inputRef = {ref => this.iphone = ref}
              />
              <TextField
                margin="dense"
                id="note"
                label="备注"
                fullWidth
                value={this.state.note}
                onChange={this.handleChange('note')}
                inputRef = {ref => this.note = ref}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.close} color="primary">
                取消
              </Button>
              <Button onClick={this.userModifyInfoOperat} color="primary">
                确定
              </Button>
            </DialogActions>
          </Dialog>
        ]
    }
}

InputUserInfo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InputUserInfo);
