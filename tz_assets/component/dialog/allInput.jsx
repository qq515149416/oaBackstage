import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';
const E = require('wangeditor');
const AllInputStyle = theme => ({
    button: {
        margin: theme.spacing.unit
    },
    textField: {
        // width: theme.breakpoints.values.sm + 100
        width: theme.breakpoints.values.lg - (24*2)
    },
    menu: {
        width: theme.breakpoints.values.sm / 2,
    },
    dialog: {
        maxWidth: theme.breakpoints.values.lg
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
    richText: {
        width: theme.breakpoints.values.lg - (24*2)
    },
    dialogContent: {
        height: 600
    }
});
class AllInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            inputAttr: this.inputAttr(),
            componentPropsType: ""
        };
        this.editor = null;
    }
    componentDidMount() {
        this.setState({
            inputAttr: this.inputAttr()
        });
        this.dialogOpen = true;
        this.props.getRef(this);
    }
    inputAttr = () => {
        let inputAttr = {};
        if(this.props.inputType) {
            this.props.inputType.forEach(item => {
                if(item.type=="select") {
                    let defaultValue = (item.defaultData.length>0?item.defaultData[0].value:"");
                    this[item.field] = {
                        value : this.props.editData ? ((item.model&&item.model.selectCode) ? item.model.selectCode(this.props.editData[item.field]): this.props.editData[item.field]) : defaultValue
                    };
                    Object.assign(inputAttr,{
                        [item.field]: {
                            label: item.label,
                            currency: this.props.editData ? ((item.model&&item.model.selectCode) ? item.model.selectCode(this.props.editData[item.field]): this.props.editData[item.field]) : defaultValue
                        }
                    });
                }else if(item.type=="switch") {
                    if(this.props.editData) {
                        const currCode = this.props.editData ? ((item.model&&item.model.selectCode) ? item.model.selectCode(this.props.editData[item.field]):this.props.editData[item.field]) : item.radioData.find(e => e.checked).value;
                        // console.log(currCode,this.props.editData[item.field],item.field,this.props.editData);
                        item.radioData.forEach(e => {
                            if(e.value==currCode) {
                                e.checked = true;
                            } else {
                                e.checked = false;
                            }
                        });
                        // console.log(item.radioData.find(e => e.checked),item,this.props.editData);
                    }
                    this[item.field] = {
                        value : item.radioData.find(e => e.checked).value
                    };
                    Object.assign(inputAttr,{
                        [item.field]: {
                            label: item.label,
                            radioData: item.radioData
                        }
                    });

                } else if(item.type=="rich_text") {
                    // let editor = null;
                    // if(document.getElementById("editor")) {
                    //     editor = new E('#editor');
                    //     editor.customConfig.onchange = (html) => {
                    //         this[item.field] = {
                    //             value: html
                    //         }
                    //     }
                    //     editor.create();
                    // }
                    Object.assign(inputAttr,{
                        [item.field]: {
                            label: item.label
                        }
                    });
                } else {
                    // this[item.field] = {
                    //     value : this.props.editData ? this.props.editData[item.field] : ""
                    // };
                    let disabled = false;
                    if(item.rule) {
                        if(item.rule.term=="edit"&&item.rule.execute=="disabled"&&this.props.editData) {
                            disabled = true;
                        }
                    }
                    Object.assign(inputAttr,{
                        [item.field]: {
                            error: item.error,
                            label: item.label,
                            defaultValue: this.props.editData ? this.props.editData[item.field] : "",
                            disabled: disabled,
                            helperText: item.helperText
                        }
                    });
                }
            });
        }
        return inputAttr;
    }
    changeInputAttr = (field,value) => {
        this.setState(state => {
            state.inputAttr[field.split(".")[0]][field.split(".")[1]] = value;
            return state;
        });
    }
    handleChange = name => event => {
        this[name.split(".")[0]] = {
            value: event.target.value
        };
        let currentItem = this.props.inputType.find(item=>item.field==name.split(".")[0]);
        if(currentItem.model) {
            if(this.props.editData) {
                currentItem.model.getSubordinateData && currentItem.model.getSubordinateData(this,"edit");
            }else {
                currentItem.model.getSubordinateData && currentItem.model.getSubordinateData(this,"add");
            }

        }
        this.setState(state => state.inputAttr[name.split(".")[0]][name.split(".")[1]] = event.target.value);
    };
    handleChecke = name => event => {
        this[name.split(".")[0]] = {
            value: event.target.value
        };
        let currentItem = this.props.inputType.find(item=>item.field==name.split(".")[0]);
        this.props.inputType.forEach(inputTypeData => {
            if(inputTypeData.rule&&inputTypeData.rule.type=="component") {
                let currentValue =  inputTypeData.rule.execute.find(item => item.index == this[inputTypeData.rule.term].value);
                // console.log(currentValue,this[inputTypeData.rule.term].value);
                if(currentValue) {
                    this.setState({
                        componentPropsType: currentValue.value
                    });
                }
            }
        });
        if(currentItem.model) {
            if(this.props.editData) {
                currentItem.model.getSubordinateData && currentItem.model.getSubordinateData(this,"edit");
            }else {
                currentItem.model.getSubordinateData && currentItem.model.getSubordinateData(this,"add");
            }
        }
        const checkedIndex = this.state.inputAttr[name.split(".")[0]][name.split(".")[1]].findIndex(item=>item.value==event.target.value);
        this.setState(state => {
            state.inputAttr[name.split(".")[0]][name.split(".")[1]].forEach(item => {
                item.checked = false;
            });
            state.inputAttr[name.split(".")[0]][name.split(".")[1]][checkedIndex].checked = true;
            return state;
        });
    }
    setComponentParam = (field,data) => {
        this[field] = {
            value: data
        };
    }
    handleClickOpen = () => {
        this.setState({ open: true });
    }
    handleClose = () => {
        this.setState({ open: false });
    };
    componentPropsType = (inputTypeData) => {
        if(this.state.componentPropsType) {
            return this.state.componentPropsType;
        } else {
            if(inputTypeData.rule&&inputTypeData.rule.type=="component") {
                let currentValue =  inputTypeData.rule.execute.find(item => item.default);
                // console.log(currentValue,this[inputTypeData.rule.term].value);
                if(currentValue) {
                    return currentValue.value;
                }else {
                    return "";
                }
            }else {
                return "";
            }
        }
    }
    returnInput = inputTypeData => {
        const {classes} = this.props;
        const {inputAttr} = this.state;
        let status = true;
        if(inputTypeData.rule&&inputTypeData.rule.type&&inputTypeData.rule.type=="add") {
            if(this.props.editData) {
                status = false;
            }
        }
        if(inputTypeData.rule&&inputTypeData.rule.type&&inputTypeData.rule.type=="edit") {
            if(!this.props.editData) {
                status = false;
            }
        }
        // if(inputTypeData.rule&&inputTypeData.rule.term&&inputTypeData.rule.type=="hidden"&&this[inputTypeData.rule.term]) {
        //     if(this[inputTypeData.rule.term].value!=inputTypeData.rule.execute) {
        //         status = false;
        //     }
        // }
        // console.log(inputTypeData);
        switch(inputTypeData.type) {
            case "component":
                if(status) {
                    const {Component} = inputTypeData;
                    return (
                        <div>
                            <span>{inputTypeData.label}</span>
                            <Component
                                editData={this.props.editData ? this.props.editData : null}
                                getData={(inputTypeData.model && inputTypeData.model.getSubordinateData)?inputTypeData.model.getSubordinateData:""}
                                data={(inputTypeData.defaultData ? inputTypeData.defaultData : "")}
                                param={(inputTypeData.param?inputTypeData.param:{})}
                                type={this.componentPropsType(inputTypeData)}
                                setComponentParam={(data) => this.setComponentParam(inputTypeData.field,data)}
                            />
                        </div>
                    );
                } else {
                    return null;
                }
            case "rich_text":
                if(status) {
                    return (
                        <div id="editor" className={classes.richText}>
                        </div>
                    );
                } else {
                    return null;
                }
            case "text":
            if(status) {
                return (
                    <TextField
                        error={inputAttr[inputTypeData.field].error}
                        margin="dense"
                        id={inputTypeData.field}
                        label={inputAttr[inputTypeData.field].label}
                        type="text"
                        fullWidth
                        className={classes.textField}
                        defaultValue={inputAttr[inputTypeData.field].defaultValue}
                        inputRef = {(ref) => this[inputTypeData.field] = ref}
                        disabled={inputAttr[inputTypeData.field].disabled}
                        helperText={inputAttr[inputTypeData.field].helperText ? inputAttr[inputTypeData.field].helperText : null}
                        onBlur={(event) => {
                            if(inputTypeData.model && inputTypeData.model.getSubordinateData) {
                                inputTypeData.model.getSubordinateData(event.target.value,this.changeInputAttr);
                            }
                        }}
                    />
                );
            } else {
                return null;
            }
            case "select":
            if(status) {
                return (
                    <TextField
                        id="site"
                        select
                        label={inputAttr[inputTypeData.field].label}
                        className={classes.textField}
                        value={inputAttr[inputTypeData.field].currency}
                        onChange={this.handleChange(inputTypeData.field+'.currency')}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu
                            },
                        }}
                        margin="normal"
                    >
                        {
                            inputTypeData.defaultData.map(item => (
                                <MenuItem value={item.value}>
                                    {item.text}
                                </MenuItem>
                            ))
                        }


                    </TextField>
                );
            } else {
                return null;
            }

            case "switch":
            if(status) {
                return (
                    <div>
                        <h5>{inputAttr[inputTypeData.field].label}</h5>
                        {
                            inputAttr[inputTypeData.field].radioData.map(e => (
                                <FormLabel>
                                    <Radio checked={e.checked} onChange={this.handleChecke(inputTypeData.field+".radioData")} value={e.value} name={e.label} aria-label={e.label} />
                                    {e.label}
                                </FormLabel>
                            ))
                        }

                    </div>
                );
            } else {
                return null;
            }

        }
    }
    showDialog = () => {
        if(this.dialogOpen) {
            this.setState({
                inputAttr: this.inputAttr()
            });
            this.dialogOpen = false;
        }

        let editor = null;
        if(document.getElementById("editor")) {
            editor = new E('#editor');
            editor.customConfig.uploadImgShowBase64 = true;
            editor.customConfig.onchange = (html) => {
                this[this.props.inputType.find(item => item.type=="rich_text").field] = {
                    value: html
                }
            }
            editor.create();
            if(this.props.editData&&this.props.editData.content) {
                editor.txt.html(this.props.editData.content);
            } else {
                editor.txt.html("请输入内容....");
            }
        }
        if(this.props.editData) {
            this.props.inputType.forEach(item => {
                if(item.model) {
                    if(item.model.editGetSubordinateData) {
                        item.model.editGetSubordinateData(this,"edit");
                    }
                }
            });
        }
        if(!this.props.editData) {
            this.props.inputType.forEach(item => {
                if(item.rule&&item.rule.clear=="add") {
                    if(item.type=="select") {
                        item.defaultData=[];
                    }
                }
            });
        }
    }
    render() {
        const {classes, title, inputType, operattext} = this.props;
        return (
            <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            fullWidth
            maxWidth="lg"
            onEntered={this.showDialog}
            PaperProps={{
                className: classes.dialog
            }}
          >
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                {
                    inputType.map(item => this.returnInput(item))
                }
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                取消
              </Button>
              <Button onClick={this.props.post} color="primary">
                {operattext}
              </Button>
            </DialogActions>
          </Dialog>
        );
    }
}
AllInput.propTypes = {
    classes: PropTypes.object.isRequired,
};
const AllInputRender = (props) => {
    return <AllInput {...props} />
}
export default withStyles(AllInputStyle)(AllInputRender);
