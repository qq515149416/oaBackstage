import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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

@inject("newTypesStores")
@observer
class NewTypeManagementList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addType: "add",
            dialogState: false,
            type_name: ""
        };
    }
    componentDidMount() {
        this.props.newTypesStores.getData();
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
            editData.type_name = param.data.name;
            this.editId = param.data.id;
        }
        this.setState(state => {
            state.dialogState = true;
            state.addType = param.type;
            return Object.assign(state,editData);
        });
    }
    deleteData = data => event => {
        let flag = confirm("是否要删除"+data.name+",此分类!");
        if(flag) {
            this.props.newTypesStores.delData({
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
            this.props.newTypesStores.changeData({
                id: this.editId,
                name: this.typename.value
            }).then(state => {
                if(state) {
                    this.closeDialogState();
                }
            });
        } else {
            this.props.newTypesStores.addData({
                name: this.typename.value
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
                        <span className={classes.fl}>文章分类管理</span>
                        <Button variant="contained" onClick={this.openDialogState({
                            type: "add",
                            data: null
                        })} className={`${classes.fr} ${classes.button}`} color="primary">
                            分类提交
                        </Button>
                    </div>
                </ListSubheader>}
                >
                    {
                        this.props.newTypesStores.types.map((item) => {
                            return (
                                <ListItem button>
                                    <ListItemText primary={item.name} />
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
                                </ListItem>
                            );
                        })
                    }
                </List>
                <Dialog
                    open={this.state.dialogState}
                    onClose={this.closeDialogState}
                    aria-labelledby="form-dialog-title"
                    >
                    <DialogTitle id="form-dialog-title">文章分类添加</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="typename"
                            label="文章分类名称"
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
NewTypeManagementList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(NewTypeManagementList);
