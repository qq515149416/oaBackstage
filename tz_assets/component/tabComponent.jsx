import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = theme => ({
    root: {
        marginTop: 10,
      flexGrow: 1,
      width: '100%',
      backgroundColor: "transparent"
    },
    tab: {
        backgroundColor: "#fff",
        boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.2), 0px -1px 5px 0px rgba(0,0,0,0.14), 0px 0px 0px 0px rgba(0,0,0,0)"
    },
    tab_item_text: {
        fontSize: 16
    }
});

class TabComponent extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     value: this.props.defaultType
        // };
    }
    handleChange = (event, value) => {
        this.props.onChange && this.props.onChange(value);
        // this.setState({ value });
    };
    render() {
        const { classes,type } = this.props;
        // const {value} = this.state;
        return (
            <div className={classes.root}>
        <AppBar position="static" className={classes.tab} color="default">
          <Tabs
            value={type}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            {
                this.props.types.map(item => (
                    <Tab classes={{
                        wrapper: classes.tab_item_text
                    }} label={item.label} value={item.value} />
                ))
            }
          </Tabs>
        </AppBar>
        {this.props.children && this.props.children}
      </div>
        );
    }
}
TabComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(TabComponent);
