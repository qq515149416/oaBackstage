
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItem from '@material-ui/core/ListItem';
// import List from '@material-ui/core/List';
// import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CommunicationIcon from "../icon/communication.jsx";
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Tooltip from '@material-ui/core/Tooltip';
import ChangeStatus from "./changeStatus.jsx";
import TextField from '@material-ui/core/TextField';
import { get,post } from '../../tool/http';
const classNames = require('classnames');

const styles = (theme) => ({
    appBar: {
        position: 'relative',
      },
      flex: {
        flex: 1,
      },
      content_container: {
          height: window.innerHeight - 64 - 110,
          overflow: "auto"
      },
      textField: {
          margin: 0,
          padding: 5,
          paddingBottom: 0
      },
      send: {
          textAlign: "right"
      },
      sendButton: {
          marginTop: 5
      },
      conversation_content_item: {
          margin: "5px 0"
      },
      block: {
          display: "block"
      },
      content: {
          marginLeft: 20
      },
      self: {
          color: "blue"
      },
      allochromatic: {
          color: "green"
      },
      date: {
          marginLeft: 10
      },
      changeStatus: {
          marginTop: 5,
          float: "left",
      }
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
  }
let listened = {

};

class ChatDialog extends React.Component {
    // 声明需要使用的Context属性
    static contextTypes = {
        socket: PropTypes.object
    }
    state = {
      open: false,
      contents: [],
      attr: {}
    };
    componentDidMount() {
        this.props.getRef && this.props.getRef(this);

    }
    keyDownSendContent = (event) => {
        // console.log(event);
        if(event.keyCode==13) {
            this.sendContent();
        }
    }
    sendContent = () => {
        const { socket } = this.context;
        const { work_order_number, customer_id } = this.state.attr;
        if(!this.send_content) {
            return ;
        }
        post("work_answer/insert",{
            work_number: work_order_number,
            answer_content: this.send_content.value
        }).then(res => {
            if(res.data.code==1) {
                this.send_content.value = "";
                // socket.emit(`to_id:${this.props.customer_id}work_num:${this.props.work_order_number}`,res.data.data);
                // socket.emit("admin_to_client",Object.assign(res.data.data,{
                //     to_id: customer_id
                // }));
                // this.setState(state => {
                //     state.contents.push(res.data.data);
                //     return state;
                // });
                setTimeout(() => {
                    this.container.scrollTop = this.content_container.offsetHeight;
                },500);
            }
        })
    }
    bindKeyEvent = () => {
        if(this.send_content) {
            this.send_content.removeEventListener("keydown",this.keyDownSendContent);
            this.send_content.addEventListener("keydown",this.keyDownSendContent);
            this.container.scrollTop = this.content_container.offsetHeight;
        }
    }
    handleClickOpen = (data) => {
        const { socket } = this.context;
        const { work_order_number } = data;
        socket.off("new_work_chat");
        socket.emit("login",{
            "work": work_order_number
        });
        socket.on("new_work_chat",content=>{
            this.setState(state=>{
                state.contents.push(content);
                return state;
            });
            setTimeout(() => {
                this.container.scrollTop = this.content_container.offsetHeight;
            },500);
        });

        this.setState({
            attr: data
        });

        get("work_answer/show",{
            work_number: work_order_number
        }).then(res => {
            if(res.data.code == 1) {
                this.setState({
                    contents: res.data.data.content,
                    open: true,
                    attr: {
                        ...this.state.attr,
                        bandwidth: res.data.data.business.bandwidth,
                        protect: res.data.data.business.protect,
                        ip: res.data.data.business.ip,
                        cabinets: res.data.data.business.cabinets
                    }
                });
            }
        });
    };

    handleClose = () => {
      this.setState({ open: false });
    };
    render() {
        const { classes } = this.props;
        const { submitter_name, work_order_status, machine_number, worktype, work_order_content,bandwidth,protect,ip,cabinets } = this.state.attr;
        return (
            <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
          onEntered={this.bindKeyEvent}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                由{submitter_name}发起{machine_number}主机的{worktype}问题,问题详细：{work_order_content},其他信息：带宽：{bandwidth} 防御：{protect} IP：{ip} 机柜：{cabinets}
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.content_container} ref={(ref) => this.container = ref}>
            <div ref={(ref) => this.content_container = ref}>
                {
                    this.state.contents.map(item => (
                        <div className={`${classes.conversation_content_item}`}>
                            <span className={`${classes.block} ${classNames({
                                [classes.self]: item.answer_role==2,
                                [classes.allochromatic]: item.answer_role==1
                            })} ${classes.date}`}>{item.answer_name} {item.created_at}</span>
                            <span className={`${classes.block} ${classes.content}`}>{item.answer_content}</span>
                        </div>
                    ))
                }
            </div>
          </div>
          {
              work_order_status < 2 && [
                <TextField
                    id="content"
                // label="Multiline"
                    multiline
                    rows="4"
                    className={classes.textField}
                    margin="normal"
                    fullWidth
                    placeholder="请填写要回复的内容"
                    inputRef={ref => this.send_content = ref}
                />,
                <div className={classes.send}>
                    {
                        work_order_status < 2 && (
                            <ChangeStatus {...this.state.attr} buttonElement={(open) => (
                                <Button variant="contained" className={classes.changeStatus} onClick={open} color="primary">
                                    更改状态
                                </Button>
                            )} postUrl="workorder/edit" nameParam="work_order_number" />
                        )
                    }
                    <Button variant="contained" onClick={this.sendContent} className={classes.sendButton} color="primary">
                        回复
                    </Button>
                </div>
              ]
          }

        </Dialog>
        );
    }
}
ChatDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatDialog);
