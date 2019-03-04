import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Collapse from '@material-ui/core/Collapse';
const ShowStyle = theme => ({
    title_container: {
        overflow: "hidden",
        marginBottom: theme.spacing.unit
    },
    title_type: {
        fontWeight: "bold",
        float: "left",
        fontSize: "16px",
    },
    title_content: {
        float: "left",
        fontSize: "16px",
    },
    dialog: {
        minWidth: theme.breakpoints.values.md
    },
    dialogContent: {
        // height: 600
    }
});
class Show extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            isnext: false
        };
    }
    componentDidMount() {
        this.props.getRef(this);
    }
    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    handleClick = () => {
        this.setState(state => ({ isnext: !state.isnext }));
    }
    render() {
        const {classes} = this.props;
        return (
            <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                className: classes.dialog
            }}
            >
            <DialogTitle id="alert-dialog-title">查看更多</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                {
                    this.props.data.map(item => {
                        if(item.type=="text") {
                            return (
                                <DialogContentText className={classes.title_container}>
                                    <span className={classes.title_type}>{item.label}：</span>
                                    <p className={classes.title_content}>
                                        {item.content}
                                    </p>
                                </DialogContentText>
                            );
                        }else if(item.type=="content") {
                            return (
                                <DialogContentText className={classes.title_container}>
                                    <span className={classes.title_type}>{item.label}：</span>
                                    <div className={classes.title_content} dangerouslySetInnerHTML = {{ __html: item.content}}>
                                    </div>
                                </DialogContentText>
                            );
                        }else if(item.type=="subordinate") {
                            let content_data = JSON.parse(item.content);
                            return (
                                <DialogContentText className={classes.title_container}>
                                    <div>
                                        <span className={classes.title_type}>{item.label}：</span>
                                        <Button onClick={this.handleClick} variant="contained" color="primary">
                                            {this.state.isnext ? "点击隐藏" : "点击查看更多"}
                                        </Button>
                                    </div>
                                    <div className={classes.title_content} style={{"clear": "both"}}>
                                        <Collapse in={this.state.isnext}>
                                            {
                                                item.subordinate.map(e => (
                                                    <p>
                                                        {
                                                            content_data[e.id] && [
                                                                <span>{e.label}：</span>,
                                                                <span>{content_data[e.id]}</span>
                                                            ]
                                                        }
                                                    </p>
                                                ))
                                            }
                                        </Collapse>
                                    </div>
                                </DialogContentText>
                            );
                        }
                    })
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                    确定
                </Button>
            </DialogActions>
            </Dialog>
        )
    }
}
Show.propTypes = {
    classes: PropTypes.object.isRequired,
};
const ShowRender = (props) => {
    return <Show {...props} />
}
export default withStyles(ShowStyle)(ShowRender);
