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
import dialogDecorator from "../../decorator/dialog";

const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    }
});
class Disposal extends React.Component {
    // constructor(props) {
    //     super(props);
    // }
    componentDidMount() {
        const { getRef } = this.props;
        getRef && getRef(this);
    }
    postForm = () => {
        if(this.props.disposal_type==1) {
            let confirm_next = confirm("是否要将"+this.props.machine_number+"机器下架");
            if(confirm_next) {
                post("under/apply_under",{
                    business_id: this.props.id,
                    remove_reason: this.remove_reason.value,
                    type: 1,
                    parent_business: this.props.parent_business
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
            let confirm_next = confirm("是否要将"+this.props.resource_detail+"资源下架");
            if(confirm_next) {
                post("under/apply_under",{
                    business_id: this.props.id,
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
        return (
            <div>
                <p>提交后信安则会收到您提交的下架申请，待审核通过后方可下架</p>
                <TextField
                    margin="dense"
                    id="name"
                    label="下架理由"
                    fullWidth
                    inputRef = {ref => this.remove_reason = ref}
                />
            </div>
        );
    }
}

@dialogDecorator({
    title: "下架申请",
    buttonType: "normal",
    type: "action",
    icon: "obtained"
})
class DisposalNormalButton extends Disposal {

}

@dialogDecorator({
    title: "下架申请",
    // buttonType: "normal",
    type: "action",
    icon: "obtained"
})
class DisposalIconButton extends Disposal {
    
}

DisposalNormalButton.propTypes = {
    classes: PropTypes.object.isRequired,
}

DisposalIconButton.propTypes = {
    classes: PropTypes.object.isRequired,
}

const DisposalNormalButtonStyle = withStyles(styles)(DisposalNormalButton);

export {DisposalNormalButtonStyle};

export default withStyles(styles)(DisposalIconButton);
