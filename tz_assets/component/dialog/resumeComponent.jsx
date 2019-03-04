import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import MenuItem from '@material-ui/core/MenuItem';
import { get,post } from "../../tool/http";
const dateFormat = require('dateformat');

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    paper: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      width: window.innerWidth - 100,
      minHeight:  window.innerHeight,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing.unit * 4,
    },
    close: {
        position: 'absolute',
        right: 5,
        top: 5
    },
    oneLineTitle: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "bold"
    },
    textField: {
        marginBottom: theme.spacing.unit,
        width: 250
    },
    formButton: {
        textAlign: 'center',
        marginTop: 20
    },
    button: {
        width: 200,
        fontSize: "16px",
        fontWeight: "bold"
    },
    iconButton: {
        ...theme.tableIconButton
    }
});
/**
 * 显示员工信息的组件
 * @param classes 类对象
 * @param buttonIcon 按钮图标组件对象
 */
class ResumeComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
            sex: 1,
            age: 0,
            departments: [

            ],
            department: 0,
            jobs: [],
            job: 0,
            entrytime: dateFormat(new Date(),"yyyy-mm-dd"),
            dimission: 0,
            email: "",
            wechat: "",
            QQ: "",
            phone: "",
            work_number: ""
        };
        this.id = null;
    }
    componentDidMount() {

    }
    handleClose = () => {
        this.setState({ open: false });
    }
    handleOpen = () => {
        get("hr/department").then(resp => {
            if(resp.data.code==1) {
                get("hr/show_employee",{
                    account_id: this.props.id
                }).then(res => {
                    if(res.data.code==1) {
                        const data = res.data.data.length ? res.data.data[0] : {};
                        this.id = data.id;
                        post("hr/jobs",{
                            depart_id: data.department
                        }).then(jobResData => {
                            if(jobResData.data.code == 1) {
                                this.setState(state => Object.assign(state,{
                                    departments: resp.data.data,
                                    jobs: jobResData.data.data,
                                    open: true,
                                    ...Object.assign(data,{
                                        entrytime: data.entrytime.split(" ")[0]
                                    })
                                }));
                            }
                        });
                    } else {
                        this.setState({
                            departments: resp.data.data,
                            open: true
                        });
                    }
                });
            }
        });

    }
    handleChange = name => event => {
        if(name=="department") {
            post("hr/jobs",{
                depart_id: event.target.value
            }).then(res => {
                if(res.data.code==1) {
                    this.setState({
                        jobs: res.data.data
                    });
                }
            });
        }
        this.setState({
            [name]: event.target.value,
        });
    }
    postData = event => {
        const postData = Object.keys(this.state).reduce((result,stateKey) => {
            if(stateKey!="departments"&&stateKey!="jobs"&&stateKey!="open") {
                result[stateKey] = this.state[stateKey];
            }
            return result;
        },{
            admin_users_id: this.props.id
        });
        if(!(postData.department && postData.department > 0)) {
            alert("请选择部门")
            return ;
        }
        if(!(postData.job && postData.job > 0)) {
            alert("请选择职位")
            return ;
        }
        if(this.id) {
            post("hr/edit_employee",Object.assign(postData,{
                id: this.id
            })).then(res => {
                if(res.data.code==1) {
                    alert(res.data.msg);
                    this.setState({
                        ...postData
                    });
                } else {
                    alert(res.data.msg);
                }
            });
        } else {
            post("hr/insert_employee",postData).then(res => {
                if(res.data.code==1) {
                    alert(res.data.msg);
                    this.setState({
                        ...postData
                    });
                } else {
                    alert(res.data.msg);
                }
            });
        }
    }
    render() {
        const {classes} = this.props;
        return [
            <Tooltip title="更改状态">
                <IconButton className={classes.iconButton} onClick={this.handleOpen} aria-label="resume show">
                    {this.props.buttonIcon}
                </IconButton>
            </Tooltip>,
            <Modal
            aria-labelledby="resume"
            aria-describedby="Personal information management"
            open={this.state.open}
            onClose={this.handleClose}
            >
                <div className={classes.paper}>
                    <Tooltip title="关闭">
                        <IconButton className={classes.close} onClick={this.handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography classes={{
                        root: classes.oneLineTitle
                    }} variant="title" id="resume title">
                        基本信息
                    </Typography>
                    <Grid container spacing={8}>
                        <Grid item xs={4}>
                            <form className={classes.container}>
                                <TextField
                                    disabled
                                    id="fullname"
                                    label="姓名"
                                    value={this.props.name}
                                    margin="normal"
                                    variant="outlined"
                                    className={classes.textField}
                                />
                                <div style={{width: "100%"}}>
                                    <span>性别：</span>
                                    <Radio
                                        checked={this.state.sex == 1}
                                        onChange={this.handleChange("sex")}
                                        value={1}
                                        name="sex"
                                        aria-label="男"
                                    /> 男
                                    <Radio
                                        checked={this.state.sex == 0}
                                        onChange={this.handleChange("sex")}
                                        value={0}
                                        name="sex"
                                        aria-label="女"
                                    /> 女
                                </div>
                                <TextField
                                    id="age"
                                    label="年龄"
                                    value={this.state.age}
                                    onChange={this.handleChange('age')}
                                    margin="normal"
                                    variant="outlined"
                                    type="number"
                                    className={classes.textField}
                                />
                                <TextField
                                    id="wechat"
                                    label="微信"
                                    value={this.state.wechat}
                                    onChange={this.handleChange('wechat')}
                                    margin="normal"
                                    variant="outlined"
                                    className={classes.textField}
                                />
                            </form>
                        </Grid>
                        <Grid item xs={4}>
                            <form className={classes.container} noValidate autoComplete="off">
                            <TextField
                                id="outlined-department"
                                select
                                label="所属部门"
                                className={classes.textField}
                                value={this.state.department}
                                onChange={this.handleChange('department')}
                                margin="normal"
                                variant="outlined"
                            >
                                <MenuItem key={0} value={0}>
                                    <em>暂无部门数据</em>
                                </MenuItem>
                                {this.state.departments.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.depart_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="outlined-job"
                                select
                                label="所属职位"
                                className={classes.textField}
                                value={this.state.job}
                                onChange={this.handleChange('job')}
                                margin="normal"
                                variant="outlined"
                            >
                                <MenuItem key={0} value={0}>
                                    <em>暂无部门数据</em>
                                </MenuItem>
                                {this.state.jobs.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.job_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="entrytime"
                                label="入职时间"
                                type="date"
                                className={classes.textField}
                                value={this.state.entrytime}
                                onChange={this.handleChange('entrytime')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                id="email"
                                label="邮箱"
                                value={this.state.email}
                                onChange={this.handleChange('email')}
                                margin="normal"
                                variant="outlined"
                                type="email"
                                className={classes.textField}
                            />
                            </form>
                        </Grid>
                        <Grid item xs={4}>
                        <form className={classes.container} noValidate autoComplete="off">
                            <TextField
                                id="work_number"
                                label="工号"
                                value={this.state.work_number}
                                onChange={this.handleChange('work_number')}
                                margin="normal"
                                variant="outlined"
                                className={classes.textField}
                            />
                            <TextField
                                id="phone"
                                label="手机号码"
                                value={this.state.phone}
                                onChange={this.handleChange('phone')}
                                margin="normal"
                                variant="outlined"
                                className={classes.textField}
                            />
                            <TextField
                                id="QQ"
                                label="QQ"
                                value={this.state.QQ}
                                onChange={this.handleChange('QQ')}
                                margin="normal"
                                variant="outlined"
                                className={classes.textField}
                            />
                            <div style={{width: "100%"}}>
                                <span>在职状态：</span>
                                <Radio
                                    checked={this.state.dimission == 0}
                                    onChange={this.handleChange("dimission")}
                                    value={0}
                                    name="dimission"
                                    aria-label="在职"
                                /> 在职
                                <Radio
                                    checked={this.state.dimission == 1}
                                    onChange={this.handleChange("dimission")}
                                    value={1}
                                    name="dimission"
                                    aria-label="离职"
                                /> 离职
                            </div>
                        </form>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.formButton}>
                                <Button onClick={this.postData} className={classes.button} variant="contained" color="primary">提交</Button>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        ];
    }
}
ResumeComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    buttonIcon: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ])
};

export default withStyles(styles)(ResumeComponent);
