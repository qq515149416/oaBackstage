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
import SettingsIcon from '@material-ui/icons/Settings';
import { post } from "../../tool/http";

const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    }
});

class SetIp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isset: false,
            ip: this.props.target_ip || ""
        }
    }
    open = () => {
        this.setState({
            isset: true
        });
    }
    close = () => {
        this.setState({
            isset: false
        });
    }
    setOperat = () => {
        post("defenseip/remove/setTarget",{
            b_id: this.props.id,
            target_ip: this.state.ip
        }).then(res => {
            if (res.data.code === 1) {
            this.props.update && this.props.update();
              this.close();
            }
            alert(res.data.msg);
        });
    }
    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    }
    render() {
        const { classes } = this.props;
        return [
            <Tooltip title="高防业务绑定IP">
                    <IconButton className={classes.iconButton} onClick={this.open} aria-label="renewalFee">
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>,
            <Dialog
          open={this.state.isset}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">高防业务绑定目标ip</DialogTitle>
          <DialogContent>
            <DialogContentText>
                <TextField
                    id="ip"
                    label="绑定ip"
                    value={this.state.ip}
                    onChange={this.handleChange('ip')}
                    margin="normal"
                    fullWidth
                />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              取消
            </Button>
            <Button onClick={this.setOperat} color="primary">
              确定
            </Button>
          </DialogActions>
        </Dialog>
        ];
    }
}
SetIp.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(SetIp);
