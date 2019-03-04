import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import WorkOrderIcon from "../icon/workOrder.jsx";
import {get,post} from "../../tool/http";
import { inject,observer } from "mobx-react";

const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    }
});

@inject("workOrderTypesStores")
class WorkOrderPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: 0,
            currency2: 0,
            workOrder: false,
            workOrderSubTypes: []
        };
    }
    componentDidMount() {
        if(!this.props.workOrderTypesStores.workOrderTypes.length) {
            this.props.workOrderTypesStores.getData();
        }
    }
    workOrderPost = () => {
        if(this.state.workOrderSubTypes.length>0&&!this.state.currency2) {
            alert("请选择二级分类");
            return ;
        }
        post("workorder/insert",{
            business_num: this.props.business_number,
            work_order_content: this.note.value,
            work_order_type: this.selectTypeId
        }).then(res => {
            if(res.data.code==1) {
                alert(res.data.msg);
                this.setState({
                    currency: 0,
                    currency2: 0
                });
                this.close();
            } else {
                alert(res.data.msg);
            }
        })
    }
    open = () => {
        this.setState({
            workOrder: true
        });
    }
    close = () => {
        this.setState({
            workOrder: false
        });
    }
    handleChange = param => event => {
        let {name,index} = param;
        if(index==0) {
            // get("workorder/work_types",{
            //     parent_id: event.target.value
            // }).then(res => {
            //     if(res.data.code==1) {
            //         if(res.data.data.length==0) {
            //             this.selectTypeId = event.target.value;
            //         }
            //         this.setState({
            //             workOrderSubTypes: res.data.data
            //         });
            //     }
            // });
            if(!this.props.workOrderTypesStores.workOrderTypes.filter(item => {
                return item.parent_id == event.target.value;
            }).length) {
                this.selectTypeId = event.target.value;
            }
            this.setState({
                workOrderSubTypes: this.props.workOrderTypesStores.workOrderTypes.filter(item => {
                    return item.parent_id == event.target.value;
                })
            });
        }
        if(index==1) {
            this.selectTypeId = event.target.value;
        }
        this.setState({
          [name]: event.target.value,
        });
    }
    render() {
        const { classes } = this.props;
        return [
            <Tooltip title="工单提交">
                <IconButton className={classes.iconButton} onClick={this.open} aria-label="renewalFee">
                    <WorkOrderIcon />
                </IconButton>
            </Tooltip>,
            <Dialog
            open={this.state.workOrder}
            onClose={this.close}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">工单提交</DialogTitle>
            <DialogContent>
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <TextField
                        id="workOrderType1"
                        select
                        label="工单类型"
                        value={this.state.currency}
                        fullWidth
                        onChange={this.handleChange({
                            name: 'currency',
                            index: 0
                        })}
                        margin="normal"
                        >
                            {
                                this.props.workOrderTypesStores.workOrderTypes.filter(item => {
                                    return item.parent_id == 0;
                                }).map(item => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.type_name}
                                    </MenuItem>
                                ))
                            }

                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        {
                            !!this.state.workOrderSubTypes.length && (
                                <TextField
                                id="workOrderType2"
                                select
                                label="工单类型"
                                fullWidth
                                value={this.state.currency2}
                                onChange={this.handleChange({
                                    name: 'currency2',
                                    index: 1
                                })}
                                margin="normal"
                                >
                                    {
                                        this.state.workOrderSubTypes.map(item => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.type_name}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                            )
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin="dense"
                            id="note"
                            label="备注"
                            multiline
                            fullWidth
                            inputRef = {ref => this.note = ref}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.close} color="primary">
                取消
              </Button>
              <Button onClick={this.workOrderPost} color="primary">
                确定
              </Button>
            </DialogActions>
          </Dialog>
        ];
    }
}
WorkOrderPost.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(WorkOrderPost);
