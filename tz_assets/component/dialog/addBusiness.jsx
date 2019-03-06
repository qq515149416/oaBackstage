import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import RenewalFeeIcon from "../icon/renewalFee.jsx";
import Button from '@material-ui/core/Button';
/**
 *@var  styles 是用来定义样式的
 */
const styles = theme => ({
    root: {
        width: 900,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    gridRoot: {
        flexGrow: 1
    },
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        cursor: "pointer",
    },
    paperActive: {
        backgroundColor: theme.palette.secondary[500],
        color: theme.palette.common.white,
    },
    iconButton: {
        ...theme.tableIconButton
    }
});


class AddBusiness extends React.Component {
    constructor(...arg) {
        super(...arg);
        this.state = {
            bingBusiness: false
        };
    }
    componentDidMount() {
        console.log(this.props);
    }
    open = () => {
        this.setState({
            bingBusiness: true
        });
    }
    close = () => {
        this.setState({
            bingBusiness: false
        });
    }
    renewalFeeOperat = () => {

    }
    show = () => {

    }
    render() {
        const { classes } = this.props;
        return [
            <Tooltip title="续费">
                <IconButton className={classes.iconButton} onClick={this.open} aria-label="renewalFee">
                    <RenewalFeeIcon />
                </IconButton>
            </Tooltip>,
             <Dialog
             open={this.state.bingBusiness}
             onClose={this.close}
             aria-labelledby="form-dialog-title"
             maxWidth="lg"
             onEntered={this.show}
           >
             <DialogTitle id="form-dialog-title">业务绑定</DialogTitle>
             <DialogContent>

             </DialogContent>
             <DialogActions>
               <Button onClick={this.close} color="primary">
                 取消
               </Button>
               <Button onClick={this.renewalFeeOperat} color="primary">
                 确定
               </Button>
             </DialogActions>
           </Dialog>
        ];
    }
}
AddBusiness.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(AddBusiness);
