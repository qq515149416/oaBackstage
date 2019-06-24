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
import FormLabel from '@material-ui/core/FormLabel';
import {get} from "../../tool/http.js";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { inject,observer } from "mobx-react";

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
    list: {
        overflow: 'auto',
        maxHeight: 400,
    },
    textField: {
        // margin: "0 10px"
    }
});

@observer
class SelectModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            type: "",
            itemChecked: this.props.check ? [] : 0,
            lineChecked: 0,
            search_text: "",
            checkedAll: false
        };
        this.type = "";
    }
    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }
    handleOpen = (type) => {
        if(this.selectedMachineValue(type)==4) {
            this.props.getData({
                resource_type: {
                    value: 4
                },
                company: 0
            });
        }
        this.type = type;
        this.setState({ open: true });
    }
    handleClose = () => {
        this.setState({ open: false });
    }
    handleSearchChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    }
    handleChange = event => {
        if(this.selectedMachineValue(this.type)==4) {
            this.props.getData({
                resource_type: {
                    value: 4
                },
                company: event.target.value
            });
        }
        this.setState({ lineChecked: event.target.value });
    }
    setCheckBoxValue = (name,value) => {
        if(this.props.check) {
            if(!this.selectedData) {
                this.selectedData = [this.props.data.find(item => item.text==value)];
            } else {
                if(this.selectedData.find(item => item.text==value)) {
                    this.selectedData.splice(this.selectedData.findIndex(item => item.text==value),1);
                } else {
                    this.selectedData.push(this.props.data.find(item => item.text==value));
                }
            }
            if(this.props.data.filter(item => item.text.indexOf(this.state.search_text) > -1).length===this.selectedData.length) {
                this.setState({
                    checkedAll: true
                });
            } else {
                this.setState({
                    checkedAll: false
                });
            }
            this.setState({
                [name]: this.selectedData,
            });
        } else {
            this.selectedData = this.props.data.find(item => item.text==value);
            this.setState({
                [name]: value,
            });
        }
    }
    selectedMachineValue = (type) => {
        switch(type) {
            case "ip_resource":
                return 4
            case "cpu_resource":
                return 5
            case "hardDisk_resource":
                return 6
            case "ram_resource":
                return 7
            case "bandwidth":
                return 8
            default:
                return 9
        }
    }
    selectedValue = () => {
        this.props.setCurrentData(this.selectedData,this.selectedMachineValue(this.type));
        this.handleClose();
    }
    handleCheckAll = name => event => {
        if(this.state.checkedAll) {
            this.selectedData = [];
            this.setState({
                [name]: false,
                itemChecked: this.selectedData
            });
        } else {
            this.selectedData = this.props.data.filter(item => item.text.indexOf(this.state.search_text) > -1);
            this.setState({
                [name]: true,
                itemChecked: this.selectedData
            });
        }
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
                    {
                        this.selectedMachineValue(this.type) == 4 ? [
                            <FormLabel>
                                <Radio
                                    checked={this.state.lineChecked==0}
                                    value={0}
                                    name="ip_resource"
                                    aria-label={"ip_resource0"}
                                    onChange={this.handleChange}
                                /> 电信
                            </FormLabel>,
                            <FormLabel>
                                <Radio
                                    checked={this.state.lineChecked==1}
                                    value={1}
                                    name="ip_resource"
                                    aria-label={"ip_resource1"}
                                    onChange={this.handleChange}
                                /> 移动
                            </FormLabel>,
                            <FormLabel>
                                <Radio
                                    checked={this.state.lineChecked==2}
                                    value={2}
                                    name="ip_resource"
                                    aria-label={"ip_resource2"}
                                    onChange={this.handleChange}
                                /> 联通
                            </FormLabel>
                        ]:null
                    }
                   <div>
                        <TextField
                            id="search-text"
                            label="搜索"
                            className={classes.textField}
                            value={this.state.search_text}
                            onChange={this.handleSearchChange('search_text')}
                            margin="normal"
                        />
                        {
                            this.props.check && (
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={this.state.checkedAll} onChange={this.handleCheckAll('checkedAll')} value="全选" />
                                        }
                                        label={("全选"+(this.state.checkedAll ? ("（共"+this.state.itemChecked.length+"个）"):""))}
                                    />
                                </FormGroup>
                            )
                        }
                   </div>
                    <List className={classes.list}>
                        {
                            this.props.data.filter(item => item.text.indexOf(this.state.search_text) > -1).map(item => (
                                <ListItem onClick={() => this.setCheckBoxValue("itemChecked",item.text)} divider button>
                                    {
                                        this.props.check ? (
                                            <Checkbox
                                                checked={!!this.state.itemChecked.find(e => e.text === item.text)}
                                                value={item.text}
                                                name="itemChecked"
                                                inputProps={{
                                                    'aria-label': "item_id_"+item.text,
                                                }}
                                            />
                                        ) : (
                                            <Radio
                                                checked={this.state.itemChecked==item.text}
                                                value={item.text}
                                                name="itemChecked"
                                                aria-label={"item_id_"+item.text}
                                            />
                                        )
                                    }

                                    <ListItemText primary={item.text} />
                                </ListItem>
                            ))
                        }

                    </List>

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
SelectModal.propTypes = {
    classes: PropTypes.object.isRequired,
};
const SelectModalWrapped = (props) => <SelectModal {...props} />;

export default withStyles(styles)(SelectModalWrapped);
