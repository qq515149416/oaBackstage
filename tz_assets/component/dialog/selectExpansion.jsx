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
            buttonName: this.props.param.buttonName,
            resourceInputError: false
        };
    }
    handleOpen = type => event => {
        this.selectModal.handleOpen(type);
    }
    handleChange = name => event => {
        if(!/^\d*$/.test(event.target.value)) {
            this.setState({
                [name]: event.target.value,
                resourceInputError: true
            });
            this.props.setComponentParam("");
            return;
        }
        this.props.setComponentParam(event.target.value);
        this.setState({
          [name]: event.target.value,
          resourceInputError: false
        });
    }
    setCurrentData = (param,type) => {
        if(Array.isArray(param)) {
            this.props.setComponentParam(param);
            if(param.length > 1) {
                this.setState({
                    buttonName: param[0].text + "到"  + param[param.length-1].text + "之间的资源"
                });
            } else {
                if(param.length) {
                    this.setState({
                        buttonName: param[0].text
                    });
                } else {
                    this.setState({
                        buttonName: "不允许为空"
                    });
                }
            }
        } else {
            this.props.setComponentParam(param.value);
            this.setState({
                buttonName: param.text
            });
        }
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
                            error={this.state.resourceInputError}
                            helperText="只能填数字"
                        />
                    )
                }
                <SelectModal check={(this.props.param && this.props.param.check)} getData={this.props.getData} data={this.props.data} setCurrentData={this.setCurrentData} getRef={(ref) => this.selectModal = ref} />
            </div>
        );
    }
}

SelectExpansion.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectExpansion);
