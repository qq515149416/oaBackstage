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
import Reset from "../icon/reset.jsx";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { post, get } from "../../tool/http";
import { inject,observer } from "mobx-react";

const classNames = require('classnames');

const styles = theme => ({
    root: {
        width: 1200,
        overflowX: 'auto'
    },
    table: {
        minWidth: 900,
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
    },
    selectAllBtn: {
        margin: "10px 10px"
    }
});
@inject("MachineRoomsStores")
@observer
class GetResource extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resource_type: this.props.resource_type,
            getResource: false,
            resources: [],
            resource_id: 0,
            change_reason: "",
            machineroom: "",
            ip_company: ""
        }
    }
    show = () => {
        this.props.MachineRoomsStores.getData();
        post("business/getresource",{
            resource_type: this.state.resource_type,
            order_id: this.props.id,
            parent_business: this.props.parent_business
        }).then(res => {
            if(res.data.code == 1) {
                this.setState({
                    resources: res.data.data
                });
            } else {
                this.setState({
                    resources: []
                });
            }
        });
    }
    open = () => {
        this.setState({
            getResource: true
        });
    }
    close = () => {
        this.setState({
            getResource: false
        });
    }
    getResourceOperat = () => {
        // const { resource } = this.state;
        // var confirm_next = confirm("是否要将"+this.props[this.props.nameParam]+this.props.type+"，续费"+this.renewalFeeDates.find(item => {
        //     return item.value == this.state.currency;
        // }).label+"?");
        // if(confirm_next) {
        //     this.props.length = this.state.currency;
        //     this.props.order_note = this.note.value;
        //     post(this.props.postUrl,{
        //     //    ...this.props,
        //         orders: Object.keys(resource).filter(item => resource[item]),
        //        business_number: this.props.business_number?this.props.business_number:undefined,
        //     //    order_sn: this.props.order_sn ? this.props.order_sn : undefined,
        //        price: this.props.money,
        //        length: this.props.length,
        //        order_note: this.props.order_note,
        //        client_id: this.props.customer_id?this.props.customer_id:this.props.client_id,
        //        resource_type: this.props.resource_type?this.props.resource_type:this.props.business_type
        //     }).then((data)=>{
        //         if(data.data.code==1) {
        //             alert(data.data.msg);
        //             this.close();
        //             this.pay.handleClickOpen(data.data.data);
        //         } else {
        //             alert(data.data.msg);
        //         }
        //     });
        // }
        var confirm_next = confirm("是否要更换"+this.props[this.props.nameParam]+"资源");
        if(confirm_next) {
            post(this.props.postUrl,{
                order_id: this.props.id,
                resource_type: this.state.resource_type,
                resource_id: this.state.resource_id,
                change_reason: this.state.change_reason,
                parent_business: this.props.parent_business
            }).then(res => {
                alert(res.data.msg);
                if(res.data.code==1) {
                    this.close();
                }
            });
        }
    }
    // handleSelectChange = items => event => {
    //     this.setState(state => {
    //         items.forEach(item => {
    //             state.resource[item.order_sn] = true;
    //         });
    //         return state;
    //     });

    // }

    // handleSelectCancelChange = items => event => {
    //     this.setState(state => {
    //         items.forEach(item => {
    //             state.resource[item.order_sn] = false;
    //         });
    //         return state;
    //     });
    // }

    inputChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

    handleChange = name => event => {
        post("business/getresource",{
            resource_type: this.state.resource_type,
            [name]: event.target.value,
            order_id: this.props.id,
            parent_business: this.props.parent_business
        }).then(res => {
            if(res.data.code == 1) {
                this.setState({
                    resources: res.data.data
                });
            } else {
                this.setState({
                    resources: []
                });
            }
        });
        this.setState({
          [name]: event.target.value,
        });
    }

    handleClick = id => event => {
        this.setState({
            resource_id: id,
        });
    }

    select = () => {
        if(this.props.resource_type<=3 && (!this.props.parent_business)) {
            return [
                <FormControl fullWidth component="fieldset">
                    <FormLabel component="legend">机器类型</FormLabel>
                    <RadioGroup aria-label="position" name="position" value={this.state.resource_type} onChange={this.handleChange("resource_type")} row>
                        <FormControlLabel
                            value="1"
                            control={<Radio color="primary" />}
                            label="租用主机"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="2"
                            control={<Radio color="primary" />}
                            label="托管主机"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="3"
                            control={<Radio color="primary" />}
                            label="租用机柜"
                            labelPlacement="end"
                        />
                    </RadioGroup>
                </FormControl>,
                <FormControl fullWidth component="fieldset">
                    <FormLabel component="legend">机房选择</FormLabel>
                    <TextField
                        id="machineRoom"
                        select
                        fullWidth
                        value={this.state.machineroom}
                        onChange={this.handleChange('machineroom')}
                        margin="normal"
                    >
                        <MenuItem key={""} value={""}>
                            请选择机房
                        </MenuItem>
                        {this.props.MachineRoomsStores.machineRooms.map(option => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.machine_room_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </FormControl>
            ];
        } else if(this.props.resource_type==4 && (!this.props.parent_business)) {
            return (
                <FormControl fullWidth component="fieldset">
                    <FormLabel component="legend">运营商</FormLabel>
                    <RadioGroup aria-label="position" name="position" value={this.state.ip_company} onChange={this.handleChange("ip_company")} row>
                        <FormControlLabel
                            value="0"
                            control={<Radio color="primary" />}
                            label="电信"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="1"
                            control={<Radio color="primary" />}
                            label="移动"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="2"
                            control={<Radio color="primary" />}
                            label="联通"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="3"
                            control={<Radio color="primary" />}
                            label="BGP"
                            labelPlacement="end"
                        />
                    </RadioGroup>
                </FormControl>
            );
        }
    }

    getTypeAttr = () => {
        switch(Number(this.state.resource_type)) {
            case 1:
                return [
                    {
                        name: "机器编号",
                        value: "machine_num"
                    },
                    {
                        name: "CPU",
                        value: "cpu"
                    },
                    {
                        name: "内存",
                        value: "memory"
                    },
                    {
                        name: "硬盘",
                        value: "harddisk"
                    },
                    {
                        name: "带宽",
                        value: "bandwidth"
                    },
                    {
                        name: "防护",
                        value: "protect"
                    },
                    {
                        name: "机房",
                        value: "machineroom_name"
                    }
                ];
            break;
            case 2:
                return [
                    {
                        name: "机器编号",
                        value: "machine_num"
                    },
                    {
                        name: "CPU",
                        value: "cpu"
                    },
                    {
                        name: "内存",
                        value: "memory"
                    },
                    {
                        name: "硬盘",
                        value: "harddisk"
                    },
                    {
                        name: "带宽",
                        value: "bandwidth"
                    },
                    {
                        name: "防护",
                        value: "protect"
                    },
                    {
                        name: "机房",
                        value: "machineroom_name"
                    }
                ];
            break;
            case 3:
                return [
                    {
                        name: "机柜编号",
                        value: "cabinet_id"
                    },
                    {
                        name: "机房",
                        value: "machineroom_name"
                    }
                ];
            break;
            case 4:
                return [
                    {
                        name: "IP",
                        value: "ip"
                    },
                    {
                        name: "机房",
                        value: "machineroom_name"
                    }
                ];
            break;
            case 5:
                return [
                    {
                        name: "编号",
                        value: "cpu_number"
                    },
                    {
                        name: "参数",
                        value: "cpu_param"
                    },
                    {
                        name: "机房",
                        value: "machineroom_name"
                    }
                ];
            break;
            case 6:
                return [
                    {
                        name: "编号",
                        value: "harddisk_number"
                    },
                    {
                        name: "参数",
                        value: "harddisk_param"
                    },
                    {
                        name: "机房",
                        value: "machineroom_name"
                    }
                ];
            break;
            case 7:
                return [
                    {
                        name: "编号",
                        value: "memory_number"
                    },
                    {
                        name: "参数",
                        value: "memory_param"
                    },
                    {
                        name: "机房",
                        value: "machineroom_name"
                    }
                ];
            break;
            default:
                return [];
            break;
        }
    }

    render() {
        const { classes } = this.props;
        const { resources, resource_id, change_reason, resource_type } = this.state;
        return [
            <Tooltip title="更换资源">
                    <IconButton className={classes.iconButton} onClick={this.open} aria-label="renewalFee">
                        <Reset />
                    </IconButton>
                </Tooltip>,
            <Dialog
          open={this.state.getResource}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
          maxWidth="lg"
          onEntered={this.show}
        >
          <DialogTitle id="form-dialog-title">更换资源</DialogTitle>
          <DialogContent>
            <DialogContentText>
                <div>
                    {
                        [
                            <p>客户：{this.props.customer_name}</p>,
                            <p>业务员：{this.props.business_name}</p>,
                            <p>业务编号：{this.props.business_sn}</p>,
                            <p>{this.props.resourcetype}：{this.props.resource}</p>,
                            <p>单价：{this.props.price}</p>,
                            <p>到期时间：{this.props.end_time}</p>
                        ]
                    }
                </div>
                <TextField
                    id="change_reason"
                    label="更换理由"
                    multiline
                    value={change_reason}
                    onChange={this.inputChange('change_reason')}
                    fullWidth
                    inputRef = {ref => this.password = ref}
                />
                {this.select()}
                <Paper className={classes.root}>
                    {
                        resource_type > 7 ? (
                            <TextField
                                margin="dense"
                                id="param"
                                label="参数值"
                                type="text"
                                fullWidth
                                onChange={this.inputChange('resource_id')}
                                value={resource_id}
                            />
                        ) : (
                            <Table className={classes.table}>
                                <TableHead>
                                <TableRow>
                                    <TableCell>*</TableCell>
                                    {this.getTypeAttr().map(item => (
                                        <TableCell>{item.name}</TableCell>
                                    ))}
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resources.map(row => (
                                        <TableRow onClick={this.handleClick(row.id)} key={row.id}>
                                            <TableCell>
                                                <Radio
                                                    checked={resource_id === row.id}
                                                    value={row.id}
                                                    name="resources"
                                                />
                                            </TableCell>
                                            {
                                                this.getTypeAttr().map(item => (
                                                    <TableCell>
                                                        {row[item.value]}
                                                    </TableCell>
                                                ))
                                            }

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )
                    }

                </Paper>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              取消
            </Button>
            <Button onClick={this.getResourceOperat} color="primary">
              确定
            </Button>
          </DialogActions>
        </Dialog>
        ];
    }
}
GetResource.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(GetResource);
