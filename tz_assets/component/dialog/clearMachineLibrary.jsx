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
import {post} from "../../tool/http";
import Reset from "../icon/reset.jsx";


const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    }
});

class ClearMachineLibrary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: 1,
            clear: false
        }
    }
    open = () => {
        this.setState({
            clear: true
        });
    }
    close = () => {
        this.setState({
            clear: false
        });
    }
    resetMachineLibrary = () => {
        post(this.props.postUrl,{
            business_number: this.props.business_number,
            type: 1,
            loginpass: this.loginpass.value
        }).then((data)=>{
            if(data.data.code==1) {
                alert(data.data.msg);
                this.props.update && this.props.update();
                this.close();
            } else {
                alert(data.data.msg);
            }
        });
    }
    randomPassword = (length) => {
        const str = "abcdefghigkrmlopqrstuvwsyz0123456789";
        let newStr = "";
        for(let i = 0; i < length; i++) {
            newStr += str.charAt((Math.random()*(str.length-1)))
        }
        return newStr;
    }
    render() {
        const { classes, resource_detail } = this.props;
        const resource_detail_json = JSON.parse(resource_detail);
        return [
            <Tooltip title="清空机器">
                    <IconButton className={classes.iconButton} onClick={this.open} aria-label="renewalFee">
                        <Reset />
                    </IconButton>
                </Tooltip>,
            <Dialog
          open={this.state.clear}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">清空机器</DialogTitle>
          <DialogContent>
            <DialogContentText>
                <p>主机编号：{resource_detail_json.machine_num}</p>
                <p>CPU：{resource_detail_json.cpu}</p>
                <p>内存：{resource_detail_json.memory}</p>
                <p>硬盘：{resource_detail_json.harddisk}</p>
                <p>IP：{resource_detail_json.ip_detail}</p>
                <p>机房：{resource_detail_json.machineroom_name}</p>
                <p>账号：{resource_detail_json.loginname}</p>
            </DialogContentText>
            <TextField
              margin="dense"
              id="note"
              label="密码修改"
              fullWidth
              defaultValue={this.randomPassword(10)}
              inputRef = {ref => this.loginpass = ref}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              取消
            </Button>
            <Button onClick={this.resetMachineLibrary} color="primary">
              确定
            </Button>
          </DialogActions>
        </Dialog>
        ];
    }
}
ClearMachineLibrary.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ClearMachineLibrary);
