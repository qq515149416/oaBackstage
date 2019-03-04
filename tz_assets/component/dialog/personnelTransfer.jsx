import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Reset from "../icon/reset.jsx";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListSubheader from '@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';
import Radio from '@material-ui/core/Radio';
import {get, post} from "../../tool/http";


const styles = theme => ({
    nested: {
      paddingLeft: theme.spacing.unit * 4,
    },
    iconButton: {
        ...theme.tableIconButton
    }
  });

class PersonnelTransfer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personnelTransfer: false,
            opens: {},
            departs: [],
            clerks: {

            },
            selectPersonneled: 0
        }
    }
    componentDidMount() {
        get("business/depart",{
            transfer: 1
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    departs: res.data.data
                });
            } else {
                console.error(res.data.msg);
            }
        });
    }
    open = () => {
        this.setState({
            personnelTransfer: true
        });
    }
    close = () => {
        this.setState({
            personnelTransfer: false
        });
    }
    transfer = () => {
        post("business/edit_clerk",{
            clerk_id: this.state.selectPersonneled,
            customer_id: this.props.id
        }).then(res => {
            if(res.data.code==1) {
                alert(res.data.msg);
                this.close();
            } else {
                alert(res.data.msg);
            }
        })
    }
    handleClick = id => event => {
        if(this.state.clerks[id] && this.state.clerks[id].length) {
            this.setState(state => {
                state.opens[id] = !state.opens[id];
                return state;
            });
        } else {
            post("business/select_clerk",{
                depart_id: id
            }).then(res => {
                if(res.data.code==1) {
                    this.setState(state => {
                        state.opens[id] = !state.opens[id];
                        state.clerks[id] = res.data.data;
                        return state;
                    });
                } else {
                    this.setState(state => {
                        state.opens[id] = !state.opens[id];
                        state.clerks[id] = [];
                        return state;
                    });
                    console.error(res.data.msg);
                }
            });
        }
    }
    selectPersonnel = id => event => {
        this.setState({
            selectPersonneled: id
        });
    }
    render() {
        const { departs, clerks, selectPersonneled } = this.state;
        const { classes } = this.props;
        return [
            <Tooltip title="人员转移">
                <IconButton className={classes.iconButton} onClick={this.open} aria-label="renewalFee">
                    <Reset />
                </IconButton>
            </Tooltip>,
            <Dialog
                open={this.state.personnelTransfer}
                onClose={this.close}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">人员转移</DialogTitle>
                <DialogContent>
                    <List
                    component="nav"
                    subheader={<ListSubheader component="div">请选择要转移的部门人员</ListSubheader>}
                    >
                        {
                            departs.map(item => [
                                <ListItem divider button onClick={this.handleClick(item.id)}>
                                    <ListItemText primary={item.depart_name} />
                                    {this.state.opens[item.id] ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>,
                                <Collapse in={this.state.opens[item.id]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {
                                            clerks[item.id] && (clerks[item.id].map(e => (
                                                <ListItem button onClick={this.selectPersonnel(e.id)} className={classes.nested}>
                                                    <Radio
                                                        checked={selectPersonneled === e.id}
                                                        value={e.id}
                                                        name={"clerk_"+item.id}
                                                    />
                                                    <ListItemText primary={e.name} />
                                                </ListItem>
                                            )))
                                        }
                                    </List>
                                </Collapse>
                            ])
                        }

                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.close} color="primary">
                        取消
                    </Button>
                    <Button onClick={this.transfer} color="primary">
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        ];
    }
}

PersonnelTransfer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PersonnelTransfer);
