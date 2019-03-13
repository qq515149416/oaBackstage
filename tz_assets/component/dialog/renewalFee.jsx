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
import RenewalFeeIcon from "../icon/renewalFee.jsx";
import MenuItem from '@material-ui/core/MenuItem';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Pay from './pay.jsx';
import { post, get } from "../../tool/http";

const classNames = require('classnames');

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
    },
    selectAllBtn: {
        margin: "10px 10px"
    }
});
class RenewalFee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: 1,
            renewalFee: false,
            resources: {
                IP: [],
                bandwidth: [],
                cdn: [],
                cpu: [],
                harddisk: [],
                memory: [],
                protected: [],
            },
            resource: {
                [this.props.order_sn ? this.props.order_sn : 0]: true
            }
        }
        this.renewalFeeDates = [
            {
                label: "一个月",
                value: 1
            },
            {
                label: "半年",
                value: 6
            },
            {
                label: "一年",
                value: 12
            }
        ];
    }
    show = () => {
        if(!this.props.order_sn) {
            get("business/all_renew",{
                business_sn: this.props.business_number
            }).then(res => {
                if(res.data.code==1) {
                    this.setState({
                        resources: {
                            ...res.data.data
                        }
                    });
                }
            })
        }
    }
    open = () => {
        this.setState({
            renewalFee: true
        });
    }
    close = () => {
        this.setState({
            renewalFee: false
        });
    }
    renewalFeeOperat = () => {
        const { resource } = this.state;
        var confirm_next = confirm("是否要将"+this.props[this.props.nameParam]+this.props.type+"，续费"+this.renewalFeeDates.find(item => {
            return item.value == this.state.currency;
        }).label+"?");
        if(confirm_next) {
            this.props.length = this.state.currency;
            this.props.order_note = this.note.value;
            post(this.props.postUrl,{
            //    ...this.props,
                orders: Object.keys(resource).filter(item => resource[item]),
               business_number: this.props.business_number?this.props.business_number:undefined,
            //    order_sn: this.props.order_sn ? this.props.order_sn : undefined,
               price: this.props.money,
               length: this.props.length,
               order_note: this.props.order_note,
               client_id: this.props.customer_id?this.props.customer_id:this.props.client_id,
               resource_type: this.props.resource_type?this.props.resource_type:this.props.business_type
            }).then((data)=>{
                if(data.data.code==1) {
                    alert(data.data.msg);
                    this.close();
                    this.pay.handleClickOpen(data.data.data);
                } else {
                    alert(data.data.msg);
                }
            });
        }
    }
    handleSelectChange = items => event => {
        this.setState(state => {
            items.forEach(item => {
                state.resource[item.order_sn] = true;
            });
            return state;
        });

    }

    handleSelectCancelChange = items => event => {
        this.setState(state => {
            items.forEach(item => {
                state.resource[item.order_sn] = false;
            });
            return state;
        });
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    }

    handleClick = id => event => {
        this.setState(state => {
            state.resource[id] = !state.resource[id];
            return state;
        });
    }

    render() {
        const { classes } = this.props;
        const { resources, resource } = this.state;
        const resource_types = {
            IP: "IP",
            bandwidth: "带宽",
            cdn: "CDN",
            cpu: "CPU",
            harddisk: "硬盘",
            memory: "内存",
            protected: "防御"
        };
        return [
            <Tooltip title="续费">
                    <IconButton className={classes.iconButton} onClick={this.open} aria-label="renewalFee">
                        <RenewalFeeIcon />
                    </IconButton>
                </Tooltip>,
            <Dialog
          open={this.state.renewalFee}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
          maxWidth="lg"
          onEntered={this.show}
        >
          <DialogTitle id="form-dialog-title">续费</DialogTitle>
          <DialogContent>
            <DialogContentText>
                {
                    this.props.order_sn ? this.props.resource + this.props.resourcetype+"资源的订单" : [
                        <p>业务编号：{this.props.business_number}</p>,
                        <p>机器编号：{this.props.machine_number}</p>,
                        <p>IP：{this.props.resource_detail_json.ip}</p>,
                        <p>单价：{this.props.money}</p>,
                        <p>到期时间：{this.props.endding_time}</p>
                    ]
                }
            </DialogContentText>
            <div className={classes.root}>
                {this.props.order_sn ? null : [
                    Object.keys(resource_types).map(byKeyVal => (
                        <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>{resource_types[byKeyVal]}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container className={classes.gridRoot} spacing={16}>
                                {
                                    resources[byKeyVal].filter(item => item.order_status!=0).map(item => (
                                        <Grid key={item.id} xs={4} item>
                                            <Paper className={classNames({
                                                [classes.paper]: true,
                                                [classes.paperActive]: resource[item.order_sn]
                                            })} onClick={this.handleClick(item.order_sn)} elevation={1}>
                                                <p>资源名称：{item.machine_sn}</p>
                                                <p>价格：{item.price}</p>
                                                <p>详细：{item.resource}</p>
                                                <p>到期时间：{item.end_time}</p>
                                            </Paper>
                                        </Grid>
                                    ))
                                }
                                <Grid xs={12} item>
                                    <Button onClick={this.handleSelectChange(resources[byKeyVal].filter(item => item.order_status!=0))} variant="contained" color="primary" className={classes.selectAllBtn}>
                                        全选
                                    </Button>
                                    <Button variant="contained" onClick={this.handleSelectCancelChange(resources[byKeyVal].filter(item => item.order_status!=0))} color="primary" className={classes.selectAllBtn}>
                                        取消全选
                                    </Button>
                                </Grid>
                            </Grid>
                    </ExpansionPanelDetails>
                    </ExpansionPanel>
                    ))

                ]}


            </div>
            <TextField
            id="renewalFee_duration"
            fullWidth
            select
            label="时长"
            value={this.state.currency}
            onChange={this.handleChange('currency')}
            margin="normal"
            >
                {
                    this.renewalFeeDates.map(item => (
                        <MenuItem key={item.value} value={item.value}>
                            {item.label}
                        </MenuItem>
                    ))
                }

            </TextField>
            <TextField
              margin="dense"
              id="note"
              label="备注"
              fullWidth
              inputRef = {ref => this.note = ref}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              取消
            </Button>
            <Button onClick={this.renewalFeeOperat} color="primary">
              确定
            </Button>
          </DialogActions>
        </Dialog>,
        <Pay getRef={(ref) => this.pay = ref} update={this.props.update} />
        ];
    }
}
RenewalFee.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(RenewalFee);
