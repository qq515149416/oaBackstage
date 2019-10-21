import React from "react";
import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import {get,post} from "../../tool/http.js";
const qs = require('qs');

class Address extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            address: false,
            selectAddress: "",
            data: [],
            operating: "添加",
            operating_state: false,
            currentValue: "",
            currentId: -1,
            showText: this.props.showText || "选择地址"
        }
    }
    handleClickOpen = () => {
        get("users/address/show",{
            user_id: qs.parse(location.search.substr(1)).id
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    address: true,
                    data: res.data.data.map(item => {
                        if(!item.id) {
                            item.id = item.address;
                        }
                        return item;
                    })
                });
            }
        });

    }
    handleClose = () => {
        this.setState({
            address: false
        });
    }
    handleChange = id => event => {
        if(this.props.model) {
            return ;
        }
        this.setState({
            selectAddress: id
        });
    }
    delAddress = id => event => {
        post("users/address/del",{
            address_id: id
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    data: this.state.data.filter(item => item.id != id)
                });
            }
        });
    }
    setCurrentData = () => {
        this.props.setComponentParam(this.state.selectAddress);
        this.setState({
            address: false,
            showText: this.state.data.find(item => item.id == this.state.selectAddress).address
        });
    }
    operatHandleClose = () => {
        this.setState({
            operating_state: false
        });
    }
    operatHandleOpen = data => event => {
        if(data) {
            this.setState({
                operating_state: true,
                currentValue: data.address,
                currentId: data.id,
                operating: "修改"
            });
        } else {
            this.setState({
                currentValue: "",
                currentId: -1,
                operating_state: true,
                operating: "添加"
            });
        }

    }
    operating = () => {
        if(this.state.currentValue) {
            post("users/address/edit",{
                address_id: this.state.currentId,
                address: this.address.value
            }).then(res => {
                if(res.data.code==1) {
                    get("users/address/show",{
                        user_id: qs.parse(location.search.substr(1)).id
                    }).then(res => {
                        if(res.data.code==1) {
                            this.setState({
                                data: res.data.data,
                                operating_state: false
                            });
                        }
                    });
                }
            });
        } else {
            post("users/address/insert",{
                user_id: qs.parse(location.search.substr(1)).id,
                address: this.address.value
            }).then(res => {
                if(res.data.code==1) {
                    get("users/address/show",{
                        user_id: qs.parse(location.search.substr(1)).id
                    }).then(res => {
                        if(res.data.code==1) {
                            this.setState({
                                data: res.data.data,
                                operating_state: false
                            });
                        }
                    });
                }
            });
        }
    }
    render() {
        const { model } = this.props;
        return [
            <div style={this.props.style}>
                <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
                    {this.state.showText}
                </Button>
            </div>,
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={this.state.address}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">地址选择</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <List>
                            {this.state.data.map(value => {
                                const labelId = `checkbox-list-label-${value.id}`;
                                return (
                                <ListItem key={value.id} role={undefined} dense button onClick={this.handleChange(value.id)}>
                                    {
                                        model ? null : (
                                            <ListItemIcon>
                                                <Radio
                                                    checked={value.id === this.state.selectAddress}
                                                    value={value.id}
                                                    name="radio-button-demo"
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </ListItemIcon>
                                        )
                                    }
                                    <ListItemText id={labelId} primary={`${value.address}`} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={this.operatHandleOpen(value)} edge="end" aria-label="edit">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={this.delAddress(value.id)} edge="end" aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                );
                            })}
                            </List>
                            <Button onClick={this.operatHandleOpen("")} color="primary">
                                添加地址
                            </Button>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                    取消
                </Button>
                {model ? null : (
                    <Button onClick={this.setCurrentData} color="primary">
                        确定
                    </Button>
                )}
                </DialogActions>
            </Dialog>,
            <Dialog
                open={this.state.operating_state}
                onClose={this.operatHandleClose}
                aria-labelledby="form-dialog-title"
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle id="form-dialog-title">{this.state.operating}地址</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="address"
                        label="地址"
                        type="text"
                        defaultValue={this.state.currentValue}
                        fullWidth
                        inputRef={ref => this.address = ref}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={this.operatHandleClose} color="primary">
                    关闭
                </Button>
                <Button onClick={this.operating} color="primary">
                    {this.state.operating}地址
                </Button>
                </DialogActions>
            </Dialog>
        ];
    }
}
export default Address;
