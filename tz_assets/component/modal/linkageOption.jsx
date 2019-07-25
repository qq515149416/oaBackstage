import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {get} from "../../tool/http.js";
import { inject,observer } from "mobx-react";
const qs = require('qs');

const styles = theme => ({
    paper: {
      position: 'absolute',
      width: theme.spacing.unit * 150,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing.unit * 4,
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)"
    },
    bottom: {
        textAlign: "right"
    },
    dialogContent: {
        overflow: "auto",
        height: 600
    },
    textField: {
        margin: "0 10px"
    }
});

@inject("MachineRoomsStores")
@observer
class LinkageOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            currency: "",
            machines: [],
            cabinets: [],
            machineSelected: "",
            type: "machine",
            cabinetChecked: 0,
            search_text: ""
        };
        this.type = "";
    }
    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
        this.props.MachineRoomsStores.getData();
    }
    getMachineData = param => event => {
        if(this.type.indexOf("machine") > -1) {
            get("business/selectmachine",param).then(res => {
                if(res.data.code==1) {
                    this.machinesAll = res.data.data;
                    this.setState({
                        machines: res.data.data
                    });
                }
            });
        } else {
            get("business/selectcabinet",param).then(res => {
                if(res.data.code==1) {
                    this.cabinetsAll = res.data.data;
                    // console.log(res.data.data);
                    this.setState({
                        cabinets: res.data.data
                    });
                }
            });
        }
    }
    handleSearchChange = name => event => {
        // if(this.type.indexOf("machine") > -1) {
        //     this.setState(state => {
        //         state.machines = state.machines.filter(item => item.machine_num.indexOf(event.target.value) > -1)
        //         return state;
        //     });
        // } else {
        //     this.setState(state => {
        //         state.cabinets = state.cabinets.filter(item => item.cabinet_id.indexOf(event.target.value) > -1 )
        //         return state;
        //     });
        // }
        console.log(event.target.value);
        if(this.type.indexOf("machine") > -1) {
            this.setState({
                [name]: event.target.value,
                machines: this.machinesAll.filter(item => item.machine_num.indexOf(event.target.value) > -1)
            });
        } else {
            this.setState({
                [name]: event.target.value,
                cabinets: this.cabinetsAll.filter(item => item.cabinet_id.indexOf(event.target.value) > -1)
            });
        }
    }
    handleOpen = (type) => {
        this.type = type;
        this.setState({ open: true });
    }
    handleClose = () => {
        this.setState({ open: false });
    }
    handleChange = name => event => {
        if(this.type.indexOf("machine") > -1) {
            this.selectedData = this.state.machines.find(item => item.id==event.target.value);
        } else {
            this.selectedData = this.state.cabinets.find(item => item.cabinet_id==event.target.value);
        }
        this.setState({
          [name]: event.target.value,
        });
    }
    setCheckBoxValue = (name,value) => {
        if(this.type.indexOf("machine")>-1) {
            this.selectedData = this.state.machines.find(item => item.id==value);
        } else {
            this.selectedData = this.state.cabinets.find(item => item.cabinet_id==value);
        }
        this.setState({
            [name]: value,
          });
    }
    selectedMachineValue = (type) => {
        switch(type) {
            case "rent_machine":
                return 1
            case "hosting_machine":
                return 2
            default:
                return 3
        }
    }
    selectedValue = () => {
        this.props.setCurrentData(this.selectedData,this.selectedMachineValue(this.type));
        this.handleClose();
    }
    render() {
        const { classes } = this.props;
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
            >
                <div className={classes.paper}>
                    <TextField
                        id="machineRoom-select-currency"
                        select
                        label="机房"
                        value={this.state.currency}
                        onChange={this.handleChange('currency')}
                        margin="normal"
                    >
                        {this.props.MachineRoomsStores.machineRooms.map(option => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.machine_room_name}
                            </MenuItem>
                        ))}
                    </TextField>
                    {
                        this.type.indexOf("machine") > -1 ? [
                            <Button variant="contained" onClick={this.getMachineData({
                                machineroom: this.state.currency,
                                business_type: this.selectedMachineValue(this.type),
                                customer_id: qs.parse(location.search.substr(1)).id
                            })} color="primary">
                                获取所属机器/机柜
                            </Button>,
                            <TextField
                            id="search-text"
                            label="搜索"
                            className={classes.textField}
                            value={this.state.search_text}
                            onChange={this.handleSearchChange('search_text')}
                            margin="normal"
                          />,
                            <div className={classes.dialogContent}>
                            <Table>
                                <TableHead>
                                <TableRow>
                                    <TableCell numeric>
                                        *
                                    </TableCell>
                                    <TableCell numeric>机器编号</TableCell>
                                    <TableCell numeric>CPU</TableCell>
                                    <TableCell numeric>内存</TableCell>
                                    <TableCell numeric>硬盘</TableCell>
                                    <TableCell numeric>IP</TableCell>
                                    {/* <TableCell numeric>机柜编号</TableCell>
                                    <TableCell numeric>IP</TableCell>
                                    <TableCell numeric>机房名</TableCell> */}
                                    <TableCell numeric>带宽</TableCell>
                                    <TableCell numeric>防护</TableCell>
                                    {/* <TableCell numeric>登录名</TableCell> */}
                                    {/* <TableCell numeric>登录密码</TableCell> */}
                                    {/* <TableCell numeric>机器型号</TableCell>
                                    <TableCell numeric>使用状态</TableCell>
                                    <TableCell numeric>机器状态</TableCell>
                                    <TableCell numeric>业务类型</TableCell> */}
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {this.state.machines.map(row => {
                                    return (
                                    <TableRow key={row.id} hover onClick={() => this.setCheckBoxValue("machineSelected",row.id)}>
                                        <TableCell numeric>
                                            <Radio
                                                checked={this.state.machineSelected == row.id}
                                                onChange={this.handleChange("machineSelected")}
                                                value={row.id}
                                                name="machine"
                                                aria-label={row.id}
                                            />
                                        </TableCell>
                                        <TableCell numeric>
                                        {row.machine_num}
                                        </TableCell>
                                        <TableCell numeric>{row.cpu}</TableCell>
                                        <TableCell numeric>{row.memory}</TableCell>
                                        <TableCell numeric>{row.harddisk}</TableCell>
                                        <TableCell numeric>{row.ip_detail}</TableCell>
                                        {/* <TableCell numeric>{row.cabinets}</TableCell>
                                        <TableCell numeric>{row.ip_detail}</TableCell>
                                        <TableCell numeric>{row.machineroom_name}</TableCell> */}
                                        <TableCell numeric>{row.bandwidth}</TableCell>
                                        <TableCell numeric>{row.protect}</TableCell>
                                        {/* <TableCell numeric>{row.loginname}</TableCell> */}
                                        {/* <TableCell numeric>{row.loginpass}</TableCell> */}
                                        {/* <TableCell numeric>{row.machine_type}</TableCell>
                                        <TableCell numeric>{row.used}</TableCell>
                                        <TableCell numeric>{row.status}</TableCell>
                                        <TableCell numeric>{row.business}</TableCell>
                                        <TableCell numeric>{row.machine_note}</TableCell> */}
                                    </TableRow>
                                    );
                                })}
                                </TableBody>
                            </Table>
                            </div>
                                ] : [
                                    <Button variant="contained" onClick={this.getMachineData({
                                        machineroom: this.state.currency
                                    })} color="primary">
                                        获取所属机柜
                                    </Button>,
                                    <TextField
                                    id="search-text"
                                    label="搜索"
                                    className={classes.textField}
                                    value={this.state.search_text}
                                    onChange={this.handleSearchChange('search_text')}
                                    margin="normal"
                                  />,
                                    <List className={classes.dialogContent}>
                                        {
                                            this.state.cabinets.map(item => (
                                                <ListItem onClick={() => this.setCheckBoxValue("cabinetChecked",item.cabinet_id)} divider button>
                                                    <Radio
                                                        checked={this.state.cabinetChecked==item.cabinet_id}
                                                        value="2"
                                                        name="cabinetChecked"
                                                        aria-label={"cabinet_id_"+item.cabinet_id}
                                                    />
                                                    <ListItemText primary={item.cabinet_id} />
                                                </ListItem>
                                            ))
                                        }

                                    </List>
                        ]
                    }

                    <div className={classes.bottom}>
                        <Button variant="contained" onClick={this.selectedValue} color="primary">
                            确定
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }
}
LinkageOption.propTypes = {
    classes: PropTypes.object.isRequired,
};
const LinkageOptionWrapped = (props) => <LinkageOption {...props} />;

export default withStyles(styles)(LinkageOptionWrapped);
