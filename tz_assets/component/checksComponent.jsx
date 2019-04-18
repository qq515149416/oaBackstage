import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
// import Chip from '@material-ui/core/Chip';
import { get } from "../tool/http.js";
import IntegrationReactSelect from './utensil/integrationReactSelect.jsx';
import Storages from 'storage-web';

const styles = theme => ({
    root: {
      display: "flex",
      justifyContent: "center",
      position: "relative"
    }
  });
class ChecksComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ip: "",
            ips: []
        };
    }

    componentDidMount() {
        if(Storages.get("ips",{
            use: 'sessionStorage',
            pre: 'pre_'
        })) {
            if(this.props.editData) {
                this.setState({
                    ip: this.props.editData.ip,
                    ips: Storages.get("ips",{
                        use: 'sessionStorage',
                        pre: 'pre_'
                    }).map(item => ({
                        value: item.id,
                        label: item.ip,
                      }))
                });
            } else {
                this.setState({
                    ips: Storages.get("ips",{
                        use: 'sessionStorage',
                        pre: 'pre_'
                    }).map(item => ({
                        value: item.id,
                        label: item.ip,
                      }))
                });
            }
            return ;
        }
        get("ips/index").then((res) => {
            // pageData
            if(res.data.code==1) {
                Storages.set("ips",res.data.data,{
                    use: 'sessionStorage',
                    pre: 'pre_',
                    expire: 5 * 60 * 1000
                });
                if(this.props.editData) {
                    this.setState({
                        ip: this.props.editData.ip,
                        ips: res.data.data.map(item => ({
                            value: item.id,
                            label: item.ip,
                          }))
                    });
                } else {
                    this.setState({
                        ips: res.data.data.map(item => ({
                            value: item.id,
                            label: item.ip,
                          }))
                    });
                }

                // this.pageData = res.data.data;
            }
        });
    }

    handleChange = name => event => {
        this.props.setComponentParam(event.target.value);
        this.setState({
            [name]: event.target.value,
        });
    }

    // handleDelete = item => () => {
    //     this.setState(state => {
    //         const selectedItem = [...state.ips];
    //         selectedItem.splice(selectedItem.indexOf(item), 1);
    //         this.props.setComponentParam(selectedItem);
    //         return { ips: selectedItem };
    //     });
    // }

    // onEnter = (event) => {
    //     if(event.keyCode==13) {
    //         this.setState(state => {
    //             state.ips.push(state.ip);
    //             state.ip = "";
    //             this.props.setComponentParam(state.ips);
    //             return state;
    //         });
    //     }
    // }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <IntegrationReactSelect defaultValue={this.props.editData ? this.state.ip : null} setComponentParam={this.props.setComponentParam} suggestions={this.state.ips} />
            </div>
        )
    }
}
ChecksComponent.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ChecksComponent);
