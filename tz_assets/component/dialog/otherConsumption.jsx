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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    appBar: {
        position: 'relative'
    },
    title: {
        marginLeft: 16,
        flex: 1
    },
    root: {
        width: '100%',
        // marginTop: theme.spacing(3),
        overflowX: 'auto',
    }
});

class OtherConsumption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otherConsumption: false,
            business: false,
            businessData: [],
            businessDataed: {}
        }
    }
    handleClickOpen = () => {
        this.setState({
            otherConsumption: true
        });
    }
    handleClose = () => {
        this.setState({
            otherConsumption: false
        });
    }
    businessHandleClickOpen = () => {
        get("business/showbusiness",{
            client_id: this.props.id
        }).then(res => {
            if(res.data.code==1) {
                this.setState({
                    business: true,
                    businessData: res.data.data
                });
            }
        });
    }
    businessHandleClose = () => {
        this.setState({
            business: false
        });
    }
    handleSelect = data => event => {
        this.setState({
            businessDataed: data
        });
    }
    handlePost = () => {
        const flag = confirm("是否要为"+this.state.businessDataed.business_number+"此业务，进行"+this.money.value+"元增值消费");
        if(flag) {
            post("business/manualpay",{
                business_number: this.state.businessDataed.business_number,
                note: this.note.value,
                money: this.money.value,
                // pay_time: this.time.value
            }).then(res => {
                alert(res.data.msg);
                if(res.data.code==1) {
                    this.setState({
                        otherConsumption: false
                    });
                }
            });
        }

    }
    render() {
        const { otherConsumption, business, businessData, businessDataed } = this.state;
        const { classes } = this.props;
        return [
            <Button style={{
                margin: "0 16px"
            }} variant="contained" onClick={this.handleClickOpen} color="primary">
                手动消费
            </Button>,
            <Dialog fullWidth={true}  maxWidth="md" open={otherConsumption} onClose={this.handleClose}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            其他消费
                        </Typography>
                        <Button color="inherit" onClick={this.handlePost}>
                            确定
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Button style={{
                        margin: "16px 0"
                    }} variant="contained" onClick={this.businessHandleClickOpen} color="primary" fullWidth>
                        {businessDataed.id ? businessDataed.business_number : "业务选择"}
                    </Button>
                    <TextField
                        margin="dense"
                        id="note"
                        label="备注"
                        type="text"
                        fullWidth
                        inputRef={(ref) => this.note = ref}
                    />
                    <TextField
                        margin="dense"
                        id="money"
                        label="消费金额"
                        type="text"
                        fullWidth
                        inputRef={(ref) => this.money = ref}
                    />
                    {/* <TextField
                        id="pay_time"
                        label="支付时间"
                        type="datetime-local"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputRef={(ref) => this.time = ref}
                        fullWidth
                    /> */}
                </DialogContent>
            </Dialog>,
            <Dialog fullWidth={true} maxWidth="xl" open={business} onClose={this.businessHandleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">业务选择</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Paper className={classes.root}>
                            <Table>
                                <TableHead>
                                <TableRow>
                                    <TableCell>*</TableCell>
                                    <TableCell>业务号</TableCell>
                                    <TableCell>业务类型</TableCell>
                                    <TableCell>机器/机柜编号</TableCell>
                                    <TableCell>业务状态</TableCell>
                                    <TableCell>单价</TableCell>
                                    <TableCell>时长</TableCell>
                                    <TableCell>开始时间</TableCell>
                                    <TableCell>结束时间</TableCell>
                                    <TableCell>备注</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {businessData.map(row => (
                                    <TableRow onClick={this.handleSelect(row)} key={row.business_number}>
                                        <TableCell>
                                            <Radio
                                                checked={businessDataed.id === row.id}
                                                value={row.id}
                                                name="business"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {row.business_number}
                                        </TableCell>
                                        <TableCell>{row.business_type}</TableCell>
                                        <TableCell>{row.machine_number}</TableCell>
                                        <TableCell>{row.business_status}</TableCell>
                                        <TableCell>{row.money}</TableCell>
                                        <TableCell>{row.length}</TableCell>
                                        <TableCell>{row.start_time}</TableCell>
                                        <TableCell>{row.endding_time}</TableCell>
                                        <TableCell>{row.business_note}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.businessHandleClose} color="primary">
                        关闭
                    </Button>
                </DialogActions>
            </Dialog>
        ]
    }
}
OtherConsumption.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(OtherConsumption);
