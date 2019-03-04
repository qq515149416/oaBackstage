import React from "react";
import TextField from '@material-ui/core/TextField';
import { inject,observer } from "mobx-react";

@inject("whitelistsStores")
@observer
class InputExpansionComponent extends React.Component {
    handleChange = attr => event => {
        this.props.whitelistsStores.handleChange({
            [attr]: event.target.value
        });
    }
    render() {
        return (
            <div>
                <TextField
                    id="binding_machine"
                    label="机器编号"
                    margin="normal"
                    fullWidth
                    onChange={this.handleChange("binding_machine")}
                    value={this.props.whitelistsStores.binding_machine}
                />
                <TextField
                    id="customer_name"
                    label="客户姓名"
                    margin="normal"
                    fullWidth
                    onChange={this.handleChange("customer_name")}
                    value={this.props.whitelistsStores.customer_name}
                />
            </div>
        );
    }
}
export default InputExpansionComponent;