import React from "react";
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

class ChecksComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ip: "",
            ips: []
        };
    }

    componentDidMount() {
        if(this.props.editData) {
            this.setState({
                ip: this.props.editData.ip
            });
        }
    }

    handleChange = name => event => {
        this.props.setComponentParam(event.target.value);
        this.setState({
            [name]: event.target.value,
        });
    }

    handleDelete = item => () => {
        this.setState(state => {
            const selectedItem = [...state.ips];
            selectedItem.splice(selectedItem.indexOf(item), 1);
            this.props.setComponentParam(selectedItem);
            return { ips: selectedItem };
        });
    }

    onEnter = (event) => {
        if(event.keyCode==13) {
            this.setState(state => {
                state.ips.push(state.ip);
                state.ip = "";
                this.props.setComponentParam(state.ips);
                return state;
            });
        }
    }

    render() {
        return (
            <div>
                {
                    this.props.editData ? (
                        <TextField
                            id="ip"
                            label="IP"
                            fullWidth
                            value={this.state.ip}
                            helperText="更改完ip后直接提交即可"
                            onChange={this.handleChange('ip')}
                            margin="normal"
                        />
                    ) : (
                        <TextField
                            id="ip"
                            label="IP"
                            fullWidth
                            helperText="填写完ip后请按下Enter（回车）键确定"
                            value={this.state.ip}
                            onChange={this.handleChange('ip')}
                            margin="normal"
                            inputProps={{
                                onKeyDownCapture: this.onEnter
                            }}
                            InputProps={{
                                startAdornment: this.state.ips.map(item => (
                                    <Chip
                                        key={item}
                                        tabIndex={-1}
                                        label={item}
                                        onDelete={this.handleDelete(item)}
                                    />
                                ))
                            }}
                        />
                    )
                }

            </div>
        )
    }
}
export default ChecksComponent;
