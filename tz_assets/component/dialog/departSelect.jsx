import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SelectModal from "../modal/selectModal.jsx";
const styles = theme => ({
    decoration: {
        margin: "0 5px"
    }
});

class DepartSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputContent: "",
            buttonName: this.props.param.buttonName
        };
    }
    componentDidMount() {
        if(this.props.editData) {
            console.log(this.props.editData);
            this.props.setComponentParam(this.props.editData.depart_id);
            this.setState({
                buttonName: this.props.editData.list_order
            });
        }
    }
    handleOpen = type => event => {
        this.selectModal.handleOpen(type);
    }
    setCurrentData = (param,type) => {
        this.props.setComponentParam(param.value);
        this.setState({
            buttonName: param.text
        });
    }
    render() {
        const {classes} = this.props;
        return (
            <div>
                <Button variant="contained" onClick={this.handleOpen("depart")} color="primary">
                    {this.state.buttonName}
                </Button>
                <SelectModal getData={this.props.getData} data={this.props.data} setCurrentData={this.setCurrentData} getRef={(ref) => this.selectModal = ref} />
            </div>
        );
    }
}
DepartSelect.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DepartSelect);
