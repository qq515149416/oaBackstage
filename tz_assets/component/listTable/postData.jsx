import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogComponent from "../dialogComponent.jsx";
const PostDataStyle = theme => ({
    button: {
        margin: theme.spacing.unit
    },
    textField: {
        width: theme.breakpoints.values.sm
    },
    menu: {
        width: theme.breakpoints.values.sm / 2,
    },
    dialog: {
        maxWidth: theme.breakpoints.values.sm + 50
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
    iconButton: {
        ...theme.tableIconButton
    }
});
class PostData extends React.Component {
    constructor(props) {
        super(props);
        // if(this.props.postType == "add") {
        //     if(this.props.inputType) {
        //         this.props.inputType.forEach(item => {
        //             if(item.rule&&item.rule.clear=="add") {
        //                 if(item.type=="select") {
        //                     item.defaultData=[];
        //                 }
        //             }
        //         });
        //     }
        // }
    }
    decompressionParam = () => {
        let returnObj = {};
        this.props.inputType.forEach(item => {
            let status = true;
            if(item.rule&&item.rule.type&&item.rule.type=="add") {
                if(this.props.editData) {
                    status = false;
                }
            }
            if(item.rule&&item.rule.type&&item.rule.type=="edit") {
                if(!this.props.editData) {
                    status = false;
                }
            }
            if(this.dialogComponent[item.field]&&status) {
                returnObj[item.field] = this.dialogComponent[item.field].value;
            } else {
                if(status) {
                    console.warn(this.dialogComponent[item.field],item.field);
                }
            }

        });
        return returnObj
    }
    post() {
        if(this.props.postType == "add") {
            this.props.addData(this.decompressionParam(),(data) => {
                if(data) {
                    this.dialogComponent.handleClose();
                }

            });
        }
        if(this.props.postType == "edit") {
            this.props.changeData(Object.assign(this.decompressionParam(),{
                id: this.props.editData.id
            }),(data) => {
                if(data) {
                    this.dialogComponent.handleClose();
                }
            });
        }
    }
    render() {
        const {classes, postType} = this.props;
        return [
            <span>
              {
                postType == "add" ? (
                <Tooltip title={this.props.addTitle || "添加"}>
                    <IconButton onClick={() => {this.dialogComponent && this.dialogComponent.handleClickOpen();}} aria-label="Add">
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                ) : (
                    <Tooltip title="编辑">
                        <IconButton className={classes.iconButton} onClick={() => {this.dialogComponent && this.dialogComponent.handleClickOpen();}} aria-label="Edit">
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                )
              }
            </span>,
            <DialogComponent
                operattext={postType == "add" ? "添加" : "修改"}
                title={postType == "add" ? "添加"+this.props.operattext : "修改"+this.props.operattext}
                post={this.post.bind(this)}
                inputType={this.props.inputType}
                getRef={ref => this.dialogComponent = ref}
                editData={postType == "add" ? null:this.props.editData}
                type="input"
            />
        ];
    }
}
PostData.propTypes = {
    classes: PropTypes.object.isRequired,
};
const PostDataRender = (props) => {
    return <PostData {...props} />
}
export default withStyles(PostDataStyle)(PostDataRender);
