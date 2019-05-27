import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SelectModal from "../modal/selectModal.jsx";
import Button from '@material-ui/core/Button';

const styles = theme => ({
    decoration: {
        margin: "0 5px"
    },
    iconButton: {
        ...theme.tableIconButton
    },
    root: {
        width: 500
    },
    textField: {
        // width: theme.breakpoints.values.sm + 100
        width: theme.breakpoints.values.lg - (24*2)
    }
});

class OverlaySelect extends React.Component {
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
    setCurrentData = (param,type) => {
        // get("defenseip/order/buyNowByAdmin",{
        //     package_id: param.value.id,
        //     customer_id: this.props.user_id
        // }).then(res => {
        //     if(res.data.code==1) {
        //         alert(res.data.msg);
        //         this.props.update();
        //     } else {
        //         alert(res.data.msg);
        //     }
        // })
        this.props.setComponentParam(param.value);
        this.setState({
            buttonName: param.text
        });
    }
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Button variant="contained" fullWidth className={classes.textField} onClick={this.handleOpen("overlay")} color="primary">
                {this.state.buttonName}
            </Button>
            <SelectModal getData={this.props.getData} data={this.props.data} setCurrentData={this.setCurrentData} getRef={(ref) => this.selectModal = ref} />
            </div>
        );
    }
}
OverlaySelect.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OverlaySelect);
