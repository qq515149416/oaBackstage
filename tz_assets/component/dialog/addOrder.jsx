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
import OrderIcon from "../icon/order.jsx";
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContentText from '@material-ui/core/DialogContentText';
import {get, post} from "../../tool/http";
import FilterSelect from "../utensil/filterSelect.jsx";

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

class AddOrder extends React.Component {
  constructor(...arg) {
    super(...arg);
    this.state = {
      bingBusiness: false,
      client_id: '',
      sales_id: '',
      resource_id: this.props.id,
      business_id: 0,
      money: '',
      length: '',
      business_note: '',
      business_type: this.props.ziyuan + '',
      sales: [],
      clients: [],
      business: [],
    };
    this.radioData = [{
      value: '1',
      label: "租用主机"
    }, {
      value: '2',
      label: "托管主机"
    }, {
      value: '3',
      label: "租用机柜"
    }]
  };
  handleChange = name => event => {
    this.setState({[name]: event.target.value});
    if (name === 'sales_id') {
      this.setState({
        clients: []
      });
      // 根据业务员的id获取客户列表
      post('business/select_users', {
        salesman_id: event.target.value
      }).then((res) => {
        if (res.data.code === 1) {
          this.setState({
            clients: res.data.data
          })
        } else {
          alert(res.data.msg);
        }
      }).catch(error => {
        console.log(error);
        alert('获取该业务员名下的客户列表失败！');
      });
    }
    if(name === 'client_id') {
        this.setState({
            business: []
          });
          // 根据业务员的id获取客户列表
          get('business/showbusiness', {
            client_id: event.target.value
          }).then((res) => {
            if (res.data.code === 1) {
              this.setState({
                business: res.data.data
              })
            } else {
              alert(res.data.msg);
            }
          }).catch(error => {
            console.log(error);
            alert('获取该业务列表失败！');
          });
    }
  };
    newHandleChange = (name,value) => {
        this.setState({[name]: value.id});
        if (name === 'sales_id') {
            this.setState({
            clients: []
            });
            // 根据业务员的id获取客户列表
            post('business/select_users', {
            salesman_id: value.id
            }).then((res) => {
            if (res.data.code === 1) {
                this.setState({
                clients: res.data.data
                })
            } else {
                alert(res.data.msg);
            }
            }).catch(error => {
            console.log(error);
            alert('获取该业务员名下的客户列表失败！');
            });
        }
        if(name === 'client_id') {
            this.setState({
                business: []
              });
              // 根据业务员的id获取客户列表
              get('business/showbusiness', {
                client_id: value.id
              }).then((res) => {
                if (res.data.code === 1) {
                  this.setState({
                    business: res.data.data
                  })
                } else {
                  alert(res.data.msg);
                }
              }).catch(error => {
                console.log(error);
                alert('获取该业务列表失败！');
              });
        }
    };
  componentDidMount() {
  };
  open = () => {
    this.setState({
      bingBusiness: true
    });
  };
  close = () => {
    this.setState({
      bingBusiness: false
    });
  };
  renewalFeeOperat = () => {
    let comfirmed = confirm('是否确定为资源' + this.props[this.props.nameParam] + '绑定业务？');
    if (comfirmed) {
      post('business/security_order', {
        customer_id: this.state.client_id,
        sales_id: this.state.sales_id,
        resource_id: this.state.resource_id,
        business_id: this.state.business_id,
        price: this.state.money,
        duration: this.state.length,
        order_note: this.state.business_note,
        resource_type: this.state.business_type
      }).then(res => {
        if (res.data.code === 1) {
          this.close();
        }
        alert(res.data.msg);
      }).catch(error => {
        alert('绑定业务失败！' + error.response.data.message);
      })
    }
  };
  show = () => {
    // 获取业务员列表
    get('business/select_sales').then((res) => {
      if (res.data.code === 1) {
        this.setState({
          sales: res.data.data
        })
      } else {
        alert(res.data.msg);
      }
    }).catch(error => {
      console.log(error);
      alert('获取业务员列表失败！');
    });
  };
  render() {
    const {classes} = this.props;
    return [
      <Tooltip title="资源录入">
        <IconButton className={classes.iconButton} onClick={this.open} aria-label="renewalFee">
          <OrderIcon/>
        </IconButton>
      </Tooltip>,
      <Dialog
          open={this.state.bingBusiness}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
          maxWidth="lg"
          fullWidth
          onEntered={this.show}
      >
        <DialogTitle id="form-dialog-title">业务绑定</DialogTitle>
        <DialogContent>
            <DialogContentText>
                <div>
                    <b>所属机房：</b>{this.props.room || this.props.ip_comproomname}
                </div>
                <FilterSelect
                    placeholder="业务员(请选择选项方可提交)"
                    suggestions={this.state.sales}
                    onChange={(item) => {
                        this.newHandleChange('sales_id',item);
                    }}
                />
                <FilterSelect
                    placeholder="业务员名下的客户(请选择选项方可提交)"
                    suggestions={this.state.clients.map(item => {
                        if(!item._name) {
                          item._name = "账号："+(item.name || "");
                          item._name += " 邮箱：" + (item.email || "");
                          item._name += " 昵称：" + (item.nickname || "");
                          item.name = item._name;
                        }
                        return item;
                    })}
                    onChange={(item) => {
                        this.newHandleChange('client_id',item);
                    }}
                />
                <FilterSelect
                    placeholder="客户的业务(请选择选项方可提交)"
                    suggestions={this.state.business.map(item => {
                        item.name = `业务号：${item.business_number} | 机器编号：${item.machine_number} | 结束时间：${item.endding_time}`;
                        return item;
                    })}
                    onChange={(item) => {
                        this.newHandleChange('business_id',item);
                    }}
                />
                {/* <TextField
                    id="sales_id"
                    label="业务员"
                    select
                    value={this.state.sales_id}
                    onChange={this.handleChange('sales_id')}
                    margin="normal"
                    fullWidth
                >
                    {this.state.sales.length > 0 ? this.state.sales.map(item => (
                        <MenuItem value={item.id}>
                        {item.name}
                        </MenuItem>
                    )) : <MenuItem value={''}>暂无业务员</MenuItem>}}
                </TextField> */}
                {/* <TextField
                    id="client_id"
                    label="业务员名下的客户"
                    value={this.state.client_id}
                    onChange={this.handleChange('client_id')}
                    margin="normal"
                    select
                    fullWidth
                >
                    {this.state.clients.length > 0 ? this.state.clients.map(item => (
                        <MenuItem value={item.id}>
                        {
                            item.name ? <span>用户名：{item.name}&nbsp;&nbsp;</span> : ''
                        }
                        {
                            item.email ? <span>邮箱：{item.email}</span> : ''
                        }
                        </MenuItem>
                    )) : <MenuItem value={''}>暂无客户</MenuItem>}
                </TextField> */}
                {/* <TextField
                    id="business"
                    label="业务员名下的客户"
                    value={this.state.business_id}
                    onChange={this.handleChange('business_id')}
                    margin="normal"
                    select
                    fullWidth
                >
                    {this.state.business.length > 0 ? this.state.business.map(item => (
                        <MenuItem value={item.id}>
                            <span>业务号：{item.business_number}&nbsp;|</span>
                            <span>机器编号：{item.machine_number}&nbsp;|</span>
                            <span>结束时间：{item.endding_time}&nbsp;|</span>
                        </MenuItem>
                    )) : <MenuItem value={''}>暂无业务</MenuItem>}
                </TextField> */}
                <TextField
                    id="money"
                    label="价格/单价"
                    type="number"
                    value={this.state.money}
                    onChange={this.handleChange('money')}
                    margin="normal"
                    fullWidth
                />
                <TextField
                    id="length"
                    label="时长"
                    type="number"
                    value={this.state.length}
                    onChange={this.handleChange('length')}
                    margin="normal"
                    fullWidth
                />
                <TextField
                    margin="dense"
                    id="business_note"
                    label="备注"
                    fullWidth
                    value={this.state.business_note}
                    onChange={this.handleChange('business_note')}
                />
            </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={this.close} color="primary">
            取消
          </Button>
          <Button onClick={this.renewalFeeOperat} color="primary">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    ];
  }
}
AddOrder.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(AddOrder);
