import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { post,get } from "../../tool/http";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionComponent from "../expansionComponent.jsx";

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    total: {
        textAlign: "right",
        fontSize: "18px",
        '& span': {
            color: '#d00'
        },
        margin: "20px 0"
    },
    iconButton: {
        ...theme.tableIconButton
    }
});

class InvoiceApplication extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            open: false,
            flow_data: [],
            address_data: [],
            address: "",
            type: "1",
            flows: []
        };
    }
    handleClickOpen = () => {
        get("users/address/show",{
            user_id: this.props.customer_id
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    open: true,
                    address_data: res.data.data
                });
            }
        });
        get("invoice/getFlow",{
            customer_id: this.props.customer_id
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    open: true,
                    flow_data: res.data.data
                });
            }
        });
    }
    handleClose = () => {
        this.setState({
            open: false
        });
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    }
    handleSelect = id => event => {
        this.setState(state => {
            if(state.flows.find(item => item == id)) {
                state.flows.splice(state.flows.findIndex(item => item == id),1);
            } else {
                state.flows.push(id);
            }
            return state;
        });
    }
    handleSelectAll = () => {
        this.setState(state => {
            if(state.flows.length==state.flow_data.length) {
                state.flows = [];
            } else {
                state.flows = state.flow_data.map(item => item.id);
            }
            return state;
        });
    }
    handleSubmit = () => {
        const { address, type, flows } = this.state;
        post("invoice/makeInvoice",{
            flow_id: flows,
            type,
            address_id: address,
            payable_id: this.props.id
        }).then(res => {
            alert(res.data.msg);
            if(res.data.code==1) {
                this.handleClose();
            }
        })
    }
    render() {
        const { classes } = this.props;
        const { open, flow_data, address_data, address, type, flows } = this.state;
        return [
            <Tooltip title="开出发票申请">
                <IconButton className={classes.iconButton} onClick={this.handleClickOpen} aria-label="invoice">
                    <InsertDriveFileIcon/>
                </IconButton>
            </Tooltip>,
            <Dialog
                open={open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="form-dialog-title">发票申请</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Table>
                            <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Checkbox
                                        checked={flows.length == flow_data.length}
                                        value="all"
                                        inputProps={{
                                            'aria-label': 'flow all',
                                        }}
                                        onChange={this.handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell>流水号</TableCell>
                                <TableCell>付款金额</TableCell>
                                <TableCell>更多</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {flow_data.map(row => (
                                <TableRow onClick={this.handleSelect(row.id)} key={row.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={Boolean(flows.find(item => item==row.id))}
                                            value={row.id}
                                            inputProps={{
                                                'aria-label': 'flow',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {row.serial_number}
                                    </TableCell>
                                    <TableCell>{row.actual_payment}</TableCell>
                                    <TableCell>
                                        <ExpansionComponent
                                            type="show"
                                            data={[
                                                {id: "order", label: "订单详情", type: "table", tableData: [
                                                    {
                                                        id: "business_sn",
                                                        label: "业务号",
                                                        type: "text"
                                                    },
                                                    {
                                                        id: "order_type",
                                                        label: "新购/续费",
                                                        type: "text"
                                                    },
                                                    {
                                                        id: "resource",
                                                        label: "资源",
                                                        type: "text"
                                                    },
                                                    {
                                                        id: "resource_type",
                                                        label: "资源类型",
                                                        type: "text"
                                                    }
                                                ]}
                                            ].map((item,index) => {
                                                // console.log(item,i,arr);
                                                return {
                                                    ...item,
                                                    content: row[item.id],
                                                    source: row
                                                };
                                            })}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </DialogContentText>
                    <DialogContentText>
                        <TextField
                            id="address"
                            select
                            label="地址选择"
                            value={address}
                            fullWidth
                            onChange={this.handleChange("address")}
                            margin="normal"
                        >
                            {address_data.map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.address}
                                </MenuItem>
                            ))}
                        </TextField>
                    </DialogContentText>
                    <DialogContentText>
                        <FormControl fullWidth component="fieldset">
                            <FormLabel style={{
                                marginBottom: 0,
                                paddingTop: 20
                            }} component="legend">发票类型</FormLabel>
                            <RadioGroup aria-label="position" name="position" value={type} onChange={this.handleChange("type")} row>
                                <FormControlLabel
                                    value="1"
                                    control={<Radio color="primary" />}
                                    label="普通"
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="2"
                                    control={<Radio color="primary" />}
                                    label="专用"
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                        </FormControl>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                    关闭
                </Button>
                <Button onClick={this.handleSubmit} color="primary">
                    确定
                </Button>
                </DialogActions>
            </Dialog>
        ];
    }
}
InvoiceApplication.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(InvoiceApplication);
