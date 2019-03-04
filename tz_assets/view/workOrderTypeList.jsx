import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteIcon from '@material-ui/icons/Delete';
import { inject,observer } from "mobx-react";

const styles = theme => ({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing.unit * 4,
    },
    fl: {
        float: "left"
    },
    fr: {
        float: "right"
    },
    clearFix: {
        overflow: "hidden"
    },
    button: {
        marginTop: 5
    },
    operat: {
        marginRight: 40
    }
});

@inject("workOrderTypesStores")
@observer 
class WorkOrderTypeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addType: "add",
            dialogState: false,
            currency: 0,
            type_name: ""
        };
    }
    componentDidMount() {
        this.props.workOrderTypesStores.getData();
    }
    handleClick = id => event => {
        this.props.workOrderTypesStores.expand(id);
    }
    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    }
    closeDialogState = event => {
        this.setState(state => {
            state.dialogState = false;
            return state;
        });
    }
    openDialogState = param => event => {
        let editData = {};
        if(param.type=="edit") {
            // console.log(param.data);
            editData.type_name = param.data.type_name;
            editData.currency = param.data.parent_id;
            this.editId = param.data.id;
        }
        this.setState(state => {
            state.dialogState = true;
            state.addType = param.type;
            return Object.assign(state,editData);
        });
    }
    deleteData = data => event => {
        let flag = confirm("是否要删除"+data.type_name+",此分类!");
        if(flag) {
            this.props.workOrderTypesStores.delData({
                delete_id: data.id
            }).then(state => {
                if(state) {
                   alert("删除成功");
                }
            });
        }
    }
    postAddType = event => {
        if(this.state.addType=="edit") {
            this.props.workOrderTypesStores.changeData({
                id: this.editId,
                type_name: this.typename.value,
                parent_id: this.state.currency
            }).then(state => {
                if(state) {
                    this.closeDialogState();
                }
            });
        } else {
            this.props.workOrderTypesStores.addData({
                type_name: this.typename.value,
                parent_id: this.state.currency
            }).then(state => {
                if(state) {
                    this.closeDialogState();
                }
            });
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <List
                    component="nav"
                    subheader={<ListSubheader  component="div">
                    <div className={classes.clearFix}>
                        <span className={classes.fl}>工单类型管理</span>
                        <Button variant="contained" onClick={this.openDialogState({
                            type: "add",
                            data: null
                        })} className={`${classes.fr} ${classes.button}`} color="primary">
                            类型提交
                        </Button>
                    </div>
                </ListSubheader>}
                >
                    {
                        this.props.workOrderTypesStores.workOrderTypes.map((item,index,arr) => {
                            if(item.parent_id==0) {
                                return [
                                    <ListItem button onClick={this.handleClick(item.id)}>
                                        <ListItemText primary={item.type_name} />
                                        <ListItemSecondaryAction className={classes.operat}>
                                            <IconButton onClick={this.deleteData(item)} aria-label="Delete">
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton onClick={this.openDialogState({
                                               type: "edit",
                                               data: item
                                            })} aria-label="Edit">
                                                <BorderColorIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                        {item.more ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>,
                                    <Collapse in={item.more} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {
                                                arr.map(e => {
                                                    if(e.parent_id==item.id) {
                                                        return (
                                                            <ListItem button className={classes.nested}>
                                                                <ListItemText primary={e.type_name} />
                                                                <ListItemSecondaryAction className={classes.operat}>
                                                                    <IconButton onClick={this.deleteData(e)} aria-label="Delete">
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                    <IconButton onClick={this.openDialogState({
                                                                    type: "edit",
                                                                    data: e
                                                                    })} aria-label="Edit">
                                                                        <BorderColorIcon />
                                                                    </IconButton>
                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                        );
                                                    }
                                                })
                                            }
                                            
                                        </List>
                                    </Collapse>
                                ];
                            }
                        })
                    }
                </List>
                <Dialog
                    open={this.state.dialogState}
                    onClose={this.closeDialogState}
                    aria-labelledby="form-dialog-title"
                    >
                    <DialogTitle id="form-dialog-title">工单类型添加</DialogTitle>
                    <DialogContent>
                        <TextField
                        id="parent_type_id"
                        select
                        label="父级"
                        fullWidth
                        value={this.state.currency}
                        onChange={this.handleChange('currency')}
                        margin="normal"
                        >
                            <MenuItem key={0} value={0}>
                                 <em>None</em>
                            </MenuItem>
                            {this.props.workOrderTypesStores.workOrderTypes.map(option => (
                               option.parent_id==0 ? (<MenuItem key={option.id} value={option.id}>
                                    {option.type_name}
                                </MenuItem>) : null
                            ))}
                        </TextField>
                        <TextField
                            margin="dense"
                            id="typename"
                            label="工单类型名称"
                            fullWidth
                            onChange={this.handleChange('type_name')}
                            value={this.state.type_name}
                            inputRef={ref => this.typename = ref}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialogState}>
                            取消
                        </Button>
                        <Button onClick={this.postAddType} color="primary">
                            确定
                        </Button>
                    </DialogActions>
                    </Dialog>
            </div>
        );
    }
}
WorkOrderTypeList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(WorkOrderTypeList);