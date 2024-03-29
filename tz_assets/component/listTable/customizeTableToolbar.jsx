import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
const dateFormat = require('dateformat');

const styles = theme => ({
    button: {
      margin: `0 ${theme.spacing.unit}px`
    }
  });

class CustomizeTableToolbar extends React.Component {
    search = (start,end) => {
        let startTime = Math.round(new Date(start.value+" 00:00:00").getTime()/1000);
        let endTime = Math.round(new Date(end.value+" 23:59:59").getTime()/1000);
        let param = this.props.param ? this.props.param : {};
        this.props.getData({
            begin: startTime,
            end: endTime,
            ...param
        });

    }
    reset = event => {
        this.props.getData();
    }
    render() {
        const {classes} = this.props;
        return [
            <TextField
                id="date"
                label="开始时间"
                type="date"
                defaultValue={dateFormat(new Date(),"yyyy-mm-dd")}
                InputLabelProps={{
                    shrink: true,
                }}
                inputRef={ref => this.dateTimeStart = ref}
            />,
            <span style={{margin: "0 10px"}}>
                —
            </span>,
            <TextField
                id="date"
                label="结束时间"
                type="date"
                defaultValue={dateFormat(new Date(),"yyyy-mm-dd")}
                InputLabelProps={{
                    shrink: true,
                }}
                inputRef={ref => this.dateTimeEnd = ref}
            />,
            <Button className={classes.button} variant="contained" onClick={() => this.search(this.dateTimeStart,this.dateTimeEnd)} color="primary">
                搜索
            </Button>,
            <Button className={classes.button} variant="contained" onClick={this.reset} color="primary">
                重置
            </Button>
        ];
    }
}
CustomizeTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CustomizeTableToolbar);
