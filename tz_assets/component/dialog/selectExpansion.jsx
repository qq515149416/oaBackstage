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

class SelectExpansion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputContent: "",
            buttonName: this.props.param.buttonName
        };
    }
    handleOpen = type => event => {
        this.selectModal.handleOpen(type);
    }
    handleChange = name => event => {
        this.props.setComponentParam(event.target.value);
        this.setState({
          [name]: event.target.value,
        });
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
                {
                    this.props.type.indexOf("resource") > -1 ? (
                        <Button variant="contained" onClick={this.handleOpen(this.props.type)} color="primary">
                            {this.state.buttonName}
                        </Button>
                    ) : (
                        <TextField
                            id="standard-name"
                            label="多少带宽/防御"
                            value={this.state.inputContent}
                            fullWidth
                            onChange={this.handleChange('inputContent')}
                            margin="normal"
                        />
                    )
                }
                <SelectModal getData={this.props.getData} data={this.props.data} setCurrentData={this.setCurrentData} getRef={(ref) => this.selectModal = ref} />
            </div>
        );
    }
}

SelectExpansion.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectExpansion);
