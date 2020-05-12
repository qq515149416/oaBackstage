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
import Switch from '@material-ui/core/Switch';
import dialogDecorator from '../../decorator/dialog';

const classNames = require('classnames');

const styles = theme => ({
    root: {
        // width: 900,
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
            resources: {
                IP: [],
                bandwidth: [],
                cdn: [],
                cpu: [],
                harddisk: [],
                memory: [],
                protected: [],
            },
            resource: this.props.order_sn ? {
                [this.props.id]: this.props
            } : {
                // [this.props.order_sn ? this.props.order_sn : 0]: true
            },
            primary: false
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
    componentDidMount() {
        const { getRef } = this.props;
        getRef && getRef(this);
    }
    show = () => {
        if(!this.props.order_sn) {
            get("business/showresource",{
                business_sn: this.props.id,
                renew: "renew"
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

    postForm = () => {
        const { resource } = this.state;
        var confirm_next = confirm("是否要将"+this.props[this.props.nameParam]+this.props.type+"，续费"+this.renewalFeeDates.find(item => {
            return item.value == this.state.currency;
        }).label+"?");
        if(confirm_next) {
            let _length = this.state.currency;
            let order_note = this.note.value;
            const expansion = {

            }
            if(this.state.primary) {
                // delete this.props.business_number;
                // expansion["business_number"] = this.props.business_number?this.props.business_number:undefined;
                resource[this.props.id] = {
                    id: this.props.id,
                    resource_type: this.props.business_type
                };
            }
            post("business/renew",{
            //    ...this.props,
                resource: Object.keys(resource).filter(item => resource[item]).map(key => ({
                    id: resource[key].id,
                    resource_type: resource[key].resource_type
                })),
            //    business_number: this.props.business_number?this.props.business_number:undefined,
            //    order_sn: this.props.order_sn ? this.props.order_sn : undefined,
                ...expansion,
            //    price: this.props.money,
               length: _length,
               order_note: order_note,
            //    client_id: this.props.customer_id?this.props.customer_id:this.props.client_id,
            //    resource_type: this.props.resource_type?this.props.resource_type:this.props.business_type
            }).then((data)=>{
                if(data.data.code==1) {
                    alert(data.data.msg);
                    // this.close();
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
                state.resource[item.id] = item;
            });
            return state;
        });

    }

    handleSelectCancelChange = items => event => {
        this.setState(state => {
            items.forEach(item => {
                state.resource[item.id] = null;
            });
            return state;
        });
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    }

    handleSwitchChange = name => event => {
        this.setState({
          [name]: event.target.checked,
        });
    }

    handleClick = item => event => {
        this.setState(state => {
            state.resource[item.id] = (!state.resource[item.id] ? item : null);
            return state;
        });
    }

    render() {
        const { classes } = this.props;
        const { resources, resource } = this.state;
        const resource_types = {
            IP: "IP",
            bandwidth: "带宽",
            // cdn: "CDN",
            cpu: "CPU",
            harddisk: "硬盘",
            memory: "内存",
            protected: "防御"
        };
        return [
            <div>
                {
                    this.props.order_sn ? this.props.resource_detail+"资源的订单" : [
                        <p>业务编号：{this.props.business_number}</p>,
                        <p>机器编号：{this.props.machine_number}</p>,
                        <p>IP：{this.props.resource_detail_json.ip}</p>,
                        <p>单价：{this.props.money}</p>,
                        <p>到期时间：{this.props.endding_time}</p>,
                        <p>主机续费：<Switch
                        checked={this.state.primary}
                        onChange={this.handleSwitchChange('primary')}
                        value="primary"
                        color="primary"
                        /></p>
                    ]
                }
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
                                                    [classes.paperActive]: resource[item.id]
                                                })} onClick={this.handleClick(item)} elevation={1}>
                                                    <p>资源名称：{item.resource_num}</p>
                                                    <p>价格：{item.price}</p>
                                                    <p>详细：{item.resource_detail}</p>
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
            </div>,
            <Pay getRef={(ref) => this.pay = ref} update={this.props.update} />
        ];
    }
}

@dialogDecorator({
    title: "续费",
    buttonType: "normal",
    type: "action",
    icon: "renewalFee"
})
class RenewalFeeNormalButton extends RenewalFee {

}

@dialogDecorator({
    title: "续费",
    // buttonType: "normal",
    type: "action",
    icon: "renewalFee"
})
class RenewalFeeIconButton extends RenewalFee {

}

RenewalFeeNormalButton.propTypes = {
    classes: PropTypes.object.isRequired,
}

RenewalFeeIconButton.propTypes = {
    classes: PropTypes.object.isRequired,
}

const RenewalFeeNormalButtonStyle = withStyles(styles)(RenewalFeeNormalButton);

export {RenewalFeeNormalButtonStyle};
export default withStyles(styles)(RenewalFeeIconButton);

