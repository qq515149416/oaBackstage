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
import Obtained from "../icon/obtained.jsx";
import {post} from "../../tool/http";

const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    }
});
class Disposal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disposal: false
        }
    }
    open = () => {
        this.setState({
            disposal: true
        });
    }
    close = () => {
        this.setState({
            disposal: false
        });
    }
    obtained = () => {
        if(this.props.disposal_type==1) {
            let confirm_next = confirm("是否要将"+this.props.machine_number+"机器下架");
            if(confirm_next) {
                post("under/apply_under",{
                    business_number: this.props.business_number,
                    remove_reason: this.remove_reason.value,
                    type: 1
                }).then((data)=>{
                    if(data.data.code==1) {
                        alert(data.data.msg);
                        this.close();
                    } else {
                        alert(data.data.msg);
                    }
                });
            }
        }

        if(this.props.disposal_type==2) {
            let confirm_next = confirm("是否要将"+this.props.resource+"资源下架");
            if(confirm_next) {
                post("under/apply_under",{
                    order_sn: this.props.order_sn,
                    remove_reason: this.remove_reason.value,
                    type: 2
                }).then((data)=>{
                    if(data.data.code==1) {
                        alert(data.data.msg);
                        this.close();
                    } else {
                        alert(data.data.msg);
                    }
                });
            }
        }

    }
    render() {
        const { classes } = this.props;
        return [
            <Tooltip title="下架申请">
                    <IconButton className={classes.iconButton} onClick={this.open} aria-label="changePassword">
                        <Obtained />
                    </IconButton>
                </Tooltip>,
            <Dialog
          open={this.state.disposal}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">下架申请</DialogTitle>
          <DialogContent>
            <DialogContentText>
              提交后信安则会收到您提交的下架申请，待审核通过后方可下架
            </DialogContentText>
            <TextField
              margin="dense"
              id="name"
              label="下架理由"
              fullWidth
              inputRef = {ref => this.remove_reason = ref}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              取消
            </Button>
            <Button onClick={this.obtained} color="primary">
              下架
            </Button>
          </DialogActions>
        </Dialog>
        ];
    }
}
Disposal.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Disposal);
