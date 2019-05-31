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
import ChangePassword from "../icon/changePassword.jsx";
import {post,get} from "../../tool/http";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import Backup from "@material-ui/icons/Backup";

const styles = theme => ({
    iconButton: {
        ...theme.tableIconButton
    },
    list: {
        overflow: 'auto',
        maxHeight: 400,
    }
  });

class OverlayBusinessSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            overlay: false,
            data: [],
            itemChecked: ""
        }
        this.selectedData = {};
    }
    open = () => {
        get("overlay/showBelong",{
            status: 0,
            user_id: this.props.user_id || this.props.customer_id
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    overlay: true,
                    data: res.data.data
                });
            }
        });

    }
    close = () => {
        this.setState({
            overlay: false
        });
    }
    use = () => {
        post(this.props.postUrl.indexOf("overlay") === -1 ? "overlay/useOverlayToDIP" : this.props.postUrl,{
            business_number: this.props.business_number,
            belong_id: this.state.itemChecked,
            order_id: this.props.id
        }).then((data)=>{
            if(data.data.code==1) {
                alert(data.data.msg);
                this.props.update && this.props.update();
                this.close();
            } else {
                alert(data.data.msg);
            }
        });
    }
    setCheckBoxValue = (name,value) => {
        this.selectedData = this.state.data.find(item => item.id==value);
        this.setState({
            [name]: value,
        });
    }
    render() {
        const { classes } = this.props;
        return [
            <Tooltip title="叠加包选择">
                    <IconButton className={classes.iconButton} onClick={this.open} aria-label="changePassword">
                        <Backup />
                    </IconButton>
                </Tooltip>,
            <Dialog
          open={this.state.overlay}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">叠加包选择</DialogTitle>
          <DialogContent>
            <DialogContentText>
                <List className={classes.list}>
                        {
                            this.state.data.map(item => (
                                <ListItem onClick={() => this.setCheckBoxValue("itemChecked",item.id)} divider button>
                                    <Radio
                                        checked={this.state.itemChecked==item.id}
                                        value={item.id}
                                        name="itemChecked"
                                        aria-label={"item_id_"+item.id}
                                    />
                                    <ListItemText primary={"名称："+item.name+"  |  "+"机房："+item.machine_room_name} />
                                </ListItem>
                            ))
                        }

                    </List>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              取消
            </Button>
            <Button onClick={this.use} color="primary">
              确定
            </Button>
          </DialogActions>
        </Dialog>
        ];
    }
}
OverlayBusinessSelect.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OverlayBusinessSelect);
