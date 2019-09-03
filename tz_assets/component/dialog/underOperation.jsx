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
import MenuItem from '@material-ui/core/MenuItem';
import Enable from "../icon/enable.jsx";
import ImageFilterBlackWhite from "../icon/ImageFilterBlackWhite.jsx";
import { get, post } from "../../tool/http";

const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    }
});
class UnderOperation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            underOperation: false,
            type: 1,
            departs: []
        }
    }
    open = type => event => {
        if(this.props.remove_status==1) {
            get("under/depart").then(res => {
                if(res.data.code==1) {
                    this.setState({
                        departs: res.data.data
                    });
                }
            });
        }
        this.setState({
            underOperation: true,
            type
        });
    }
    close = () => {
        this.setState({
            underOperation: false
        });
    }
    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    }
    obtained = () => {
        let param = {};
        if(this.props.obtained_type == 1) {
            param["business_number"] = this.props.business_number;
            param["type"] = 1;
            param["parent_business"] = this.props.parent_business;
            if(this.state.type != 1) {
                param["remove_status"] = 0;
                param["remove_reason"] = this.note.value;
            }
        }
        if(this.props.obtained_type == 2) {
            param["order_sn"] = this.props.order_sn;
            param["type"] = 2;
            if(this.state.type != 1) {
                // param["machineroom"] = this.state.depart_ed;
                param["remove_status"] = 0;
                param["remove_reason"] = this.note.value;
            }
        }
        post("under/do_under",param).then(res => {
            if(res.data.code == 1) {
                alert(res.data.msg);
                this.props.update && this.props.update();
                this.close();
            } else {
                alert(res.data.msg);
            }
        })
    }
    render() {
        const { classes } = this.props;
        return [
            <Tooltip title="业务下架通过">
                <IconButton className={classes.iconButton} onClick={this.open(1)} aria-label="success">
                    <Enable />
                </IconButton>
            </Tooltip>,
            <Tooltip title="业务下架驳回">
                <IconButton className={classes.iconButton} onClick={this.open(2)} aria-label="fail">
                    <ImageFilterBlackWhite />
                </IconButton>
            </Tooltip>,
            <Dialog
                open={this.state.underOperation}
                onClose={this.close}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">下架审核</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        通知机房代表着你同意了这次的下架审核，网维将会收到这次的下架请求并进行处理，请您谨慎选择
                    </DialogContentText>
                    {
                        this.state.type == 2 && (
                            <TextField
                                margin="dense"
                                id="note"
                                label="驳回原因"
                                fullWidth
                                inputRef = {ref => this.note = ref}
                            />
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.close} color="primary">
                    取消
                    </Button>
                    <Button onClick={this.obtained} color="primary">
                    确定
                    </Button>
                </DialogActions>
            </Dialog>
        ];
    }
}
UnderOperation.propTypes = {
    obtained_type: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(UnderOperation);
