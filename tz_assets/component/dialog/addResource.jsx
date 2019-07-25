import React from "react";
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import InputExpansion from "./inputExpansion.jsx";
import Button from '@material-ui/core/Button';
import { post } from "../../tool/http";
const qs = require('qs');

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

  class AddResource extends React.Component {
    state = {
        resource: false
    };
    open = () => {
        this.setState({
            resource: true
        });
    };
    close = () => {
        this.setState({
            resource: false
        });
    };
    show = () => {

    };
    postOperat = () => {
        post("business/cabinetmachine",{
            customer: qs.parse(location.search.substr(1)).id,
            parent_business: this.props.id,
            resource_type: 2,
            resource_id: this.machine._id,
            price: this.money.value,
            duration: this.length.value,
            business_note: this.business_note.value
        }).then(res => {
            if(res.data.code==1) {
                this.props.update && this.props.update();
                this.close();
            }
            alert(res.data.msg);
        }).catch(error => {
            alert('绑定业务失败！' + error.response.data.message);
        });
    }
    render() {
        const {classes} = this.props;
        return [
            <Tooltip title="资源录入">
              <IconButton className={classes.iconButton} onClick={this.open} aria-label="renewalFee">
                <ShoppingCart />
              </IconButton>
            </Tooltip>,
            <Dialog
                open={this.state.resource}
                onClose={this.close}
                aria-labelledby="form-dialog-title"
                maxWidth="lg"
                fullWidth
                onEntered={this.show}
            >
              <DialogTitle id="form-dialog-title">业务绑定</DialogTitle>
              <DialogContent>
                <TextField
                    id="money"
                    label="价格/单价"
                    type="number"
                    margin="normal"
                    fullWidth
                    inputRef={ref => this.money = ref}
                />
                <TextField
                    id="length"
                    label="时长"
                    type="number"
                    margin="normal"
                    fullWidth
                    inputRef={ref => this.length = ref}
                />
                <TextField
                    id="business_note"
                    label="备注"
                    type="text"
                    margin="normal"
                    multiline
                    rows="4"
                    fullWidth
                    inputRef={ref => this.business_note = ref}
                />
                <div style={{
                    margin: "20px 0"
                }}>
                    <span>
                        <b>主机编号：</b>
                    </span>
                    <InputExpansion
                        type="hosting_machine"
                        setComponentParam={data => this.machine = data}
                    />
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.close} color="primary">
                  取消
                </Button>
                <Button onClick={this.postOperat} color="primary">
                  确定
                </Button>
              </DialogActions>
            </Dialog>
          ];
    }
  }
  AddResource.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  export default withStyles(styles)(AddResource);
