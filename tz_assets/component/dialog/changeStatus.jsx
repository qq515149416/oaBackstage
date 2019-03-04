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
import ChangeStatusIcon from "../icon/changeStatus.jsx";
import MenuItem from '@material-ui/core/MenuItem';
import {post} from "../../tool/http";
import { inject,observer } from "mobx-react";

const styles = theme => ({
    root: {
        float: "left",
        padding: "0 10px"
    },
    iconButton: {
        ...theme.tableIconButton
    },
    interval: {
        marginLeft: 10
    }
});

@inject("workOrdersStores")
@observer
class ChangeStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: this.props.work_order_status,
            changeStatus: false,
            department: this.props.process_department
        };
        const status_text = {
            // "0": "待处理",
            "1": "处理中",
            "2": "完成",
            // "3": "取消"
        };
        let status_code_list = [];
        status_code_list = ["1","2"];
        // if(this.props.work_order_status==0) {
        //     status_code_list = ["0","1","2","3"];
        // }
        // if(this.props.work_order_status==1) {
        //     status_code_list = ["1","2","3"];
        // }
        // if(this.props.work_order_status==2) {
        //     status_code_list = ["2"];
        // }
        // if(this.props.work_order_status==3) {
        //     status_code_list = ["3"];
        // }
        this.status = status_code_list.map(item => ({
            label: status_text[item],
            value: Number(item)
        }));
    }
    open = () => {
        this.setState({
            changeStatus: true
        });
    }
    close = () => {
        this.setState({
            changeStatus: false
        });
    }
    changeStatusOperat = () => {
        // var confirm_next = confirm("是否要更改"+this.props[this.props.nameParam]+"，状态为："+this.status.find(item => item.value == this.state.currency).label+"?");
        // if(confirm_next) {
        post(this.props.postUrl,{
            id: this.props.id,
            work_order_status: this.state.currency,
            process_department: this.state.department,
            summary: this.summary?this.summary.value:""
        }).then((data)=>{
            if(data.data.code==1) {
                alert(data.data.msg);
                this.props.workOrdersStores.getData({
                    work_order_status: 0
                });
                this.props.workOrdersStores.getData({
                    work_order_status: 1
                });
                this.close();
            } else {
                alert(data.data.msg);
            }
        });
        // }
    }
    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <span>更改当前状态：</span>
                <TextField
                    id="status"
                    select
                    value={this.state.currency}
                    onChange={this.handleChange('currency')}
                    margin="normal"
                >
                        {
                            this.status.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))
                        }
                </TextField>
                <span className={classes.interval}>转发部门：</span>
                    <TextField
                        id="department"
                        select
                        value={this.state.department}
                        onChange={this.handleChange('department')}
                        margin="normal"
                    >
                        <MenuItem key={0} value={0}>
                            <em>None</em>
                        </MenuItem>
                        {
                            this.props.workOrdersStores.department.map(item => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.depart_name}
                                </MenuItem>
                            ))
                        }
                    </TextField>
                    <Button variant="contained" onClick={this.changeStatusOperat} color="primary">
                        更改状态
                    </Button>
            </div>
        );
        // return [
        //     (this.props.buttonElement ? this.props.buttonElement(this.open) :(<Tooltip title="更改状态">
        //     <IconButton className={classes.iconButton} onClick={this.open} aria-label="renewalFee">
        //         <ChangeStatusIcon />
        //     </IconButton>
        // </Tooltip>)),
        //     <Dialog
        //   open={this.state.changeStatus}
        //   onClose={this.close}
        //   aria-labelledby="form-dialog-title"
        // >
        //   <DialogTitle id="form-dialog-title">更改状态和所属部门</DialogTitle>
        //   <DialogContent>


        //     {
        //         this.state.currency==2 && (
        //             <TextField
        //             margin="dense"
        //             id="summary"
        //             label="总结"
        //             fullWidth
        //             inputRef = {ref => this.summary = ref}
        //             />
        //         )
        //     }
        //   </DialogContent>
        //   <DialogActions>
        //     <Button onClick={this.close} color="primary">
        //       取消
        //     </Button>
        //     <Button onClick={this.changeStatusOperat} color="primary">
        //       确定
        //     </Button>
        //   </DialogActions>
        // </Dialog>
        // ];
    }
}
ChangeStatus.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ChangeStatus);
